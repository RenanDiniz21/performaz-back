import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";
import type {
	CreateVendorDto,
	UpdateVendorDto,
	UpdateVendorStatusDto,
} from "./dto/vendor.dto";

@Injectable()
export class VendorsService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async findAll() {
		return this.db.select().from(schema.vendors);
	}

	async findOne(id: string) {
		const [vendor] = await this.db
			.select()
			.from(schema.vendors)
			.where(eq(schema.vendors.id, id));
		if (!vendor) throw new NotFoundException("Vendedor não encontrado");
		return vendor;
	}

	async create(dto: CreateVendorDto) {
		const exists = await this.db
			.select({ id: schema.vendors.id })
			.from(schema.vendors)
			.where(eq(schema.vendors.email, dto.email));
		if (exists.length) throw new ConflictException("E-mail já cadastrado");

		const passwordHash = await bcrypt.hash(dto.password, 12);
		const { password, ...rest } = dto;
		const [vendor] = await this.db
			.insert(schema.vendors)
			.values({ ...rest, passwordHash })
			.returning();
		return vendor;
	}

	async update(id: string, dto: UpdateVendorDto) {
		await this.findOne(id);
		const { password, ...rest } = dto;
		const updates: Record<string, unknown> = { ...rest, updatedAt: new Date() };
		if (password) updates.passwordHash = await bcrypt.hash(password, 12);
		const [vendor] = await this.db
			.update(schema.vendors)
			.set(updates)
			.where(eq(schema.vendors.id, id))
			.returning();
		return vendor;
	}

	async updateStatus(id: string, dto: UpdateVendorStatusDto) {
		await this.findOne(id);
		const [vendor] = await this.db
			.update(schema.vendors)
			.set({ status: dto.status, updatedAt: new Date() })
			.where(eq(schema.vendors.id, id))
			.returning();
		return vendor;
	}

	async remove(id: string) {
		await this.findOne(id);
		await this.db.delete(schema.vendors).where(eq(schema.vendors.id, id));
	}
}
