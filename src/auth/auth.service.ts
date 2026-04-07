import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";
import type { LoginDto, VendorLoginDto } from "./dto/login.dto";
import type { JwtPayload } from "./strategies/jwt.strategy";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

@Injectable()
export class AuthService {
	constructor(
		@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
		private jwt: JwtService,
		private config: ConfigService,
	) {}

	async loginManager(dto: LoginDto) {
		const [user] = await this.db
			.select()
			.from(schema.users)
			.where(eq(schema.users.email, dto.email));
		if (!user) throw new UnauthorizedException("Credenciais inválidas");

		await this.checkLock(
			user.lockedUntil,
			user.loginAttempts,
			schema.users,
			user.id,
		);

		const valid = await bcrypt.compare(dto.password, user.passwordHash);
		if (!valid) {
			await this.incrementAttempts(schema.users, user.id, user.loginAttempts);
			throw new UnauthorizedException("Credenciais inválidas");
		}

		await this.resetAttempts(schema.users, user.id);
		return this.generateTokens({
			sub: user.id,
			email: user.email,
			role: "GESTOR",
		});
	}

	async loginVendor(dto: VendorLoginDto) {
		const [vendor] = await this.db
			.select()
			.from(schema.vendors)
			.where(eq(schema.vendors.matricula, dto.matricula));
		if (!vendor) throw new UnauthorizedException("Credenciais inválidas");

		await this.checkLock(
			vendor.lockedUntil,
			vendor.loginAttempts,
			schema.vendors,
			vendor.id,
		);

		const valid = await bcrypt.compare(dto.password, vendor.passwordHash);
		if (!valid) {
			await this.incrementAttempts(
				schema.vendors,
				vendor.id,
				vendor.loginAttempts,
			);
			throw new UnauthorizedException("Credenciais inválidas");
		}

		await this.db
			.update(schema.vendors)
			.set({ lastActive: new Date(), loginAttempts: 0, lockedUntil: null })
			.where(eq(schema.vendors.id, vendor.id));
		return this.generateTokens({
			sub: vendor.id,
			email: vendor.email,
			role: "VENDEDOR",
		});
	}

	async refresh(refreshToken: string) {
		try {
			const payload = this.jwt.verify<JwtPayload>(refreshToken, {
				secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
			});
			return this.generateTokens({
				sub: payload.sub,
				email: payload.email,
				role: payload.role,
			});
		} catch {
			throw new UnauthorizedException("Refresh token inválido");
		}
	}

	private async generateTokens(payload: JwtPayload) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwt.signAsync(payload, {
				secret: this.config.getOrThrow("JWT_SECRET"),
				expiresIn: this.config.getOrThrow("JWT_EXPIRES_IN"),
			}),
			this.jwt.signAsync(payload, {
				secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
				expiresIn: this.config.getOrThrow("JWT_REFRESH_EXPIRES_IN"),
			}),
		]);
		return { accessToken, refreshToken };
	}

	private async checkLock(
		lockedUntil: Date | null,
		attempts: number,
		table: any,
		id: string,
	) {
		if (lockedUntil && lockedUntil > new Date()) {
			throw new UnauthorizedException(
				`Conta bloqueada. Tente novamente após ${lockedUntil.toISOString()}`,
			);
		}
	}

	private async incrementAttempts(table: any, id: string, current: number) {
		const attempts = current + 1;
		const lock =
			attempts >= MAX_ATTEMPTS
				? new Date(Date.now() + LOCK_MINUTES * 60_000)
				: null;
		await this.db
			.update(table)
			.set({ loginAttempts: attempts, lockedUntil: lock })
			.where(eq(table.id, id));
	}

	private async resetAttempts(table: any, id: string) {
		await this.db
			.update(table)
			.set({ loginAttempts: 0, lockedUntil: null })
			.where(eq(table.id, id));
	}
}
