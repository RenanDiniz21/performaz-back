import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export interface JwtPayload {
	sub: string;
	email: string;
	role: "GESTOR" | "VENDEDOR";
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.getOrThrow("JWT_SECRET"),
		});
	}

	validate(payload: JwtPayload) {
		if (!payload.sub) throw new UnauthorizedException();
		return payload;
	}
}
