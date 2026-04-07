import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { eq, ilike, or } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";
import type { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

@Injectable()
export class ProductsService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async findAll(search?: string) {
		if (search) {
			return this.db
				.select()
				.from(schema.products)
				.where(
					or(
						ilike(schema.products.name, `%${search}%`),
						ilike(schema.products.code, `%${search}%`),
					),
				);
		}
		return this.db.select().from(schema.products);
	}

	async findOne(id: string) {
		const [product] = await this.db
			.select()
			.from(schema.products)
			.where(eq(schema.products.id, id));
		if (!product) throw new NotFoundException("Produto não encontrado");
		return product;
	}

	async create(dto: CreateProductDto) {
		const exists = await this.db
			.select({ id: schema.products.id })
			.from(schema.products)
			.where(eq(schema.products.code, dto.code));
		if (exists.length)
			throw new ConflictException("Código de produto já cadastrado");
		const [product] = await this.db
			.insert(schema.products)
			.values(dto)
			.returning();
		return product;
	}

	async update(id: string, dto: UpdateProductDto) {
		await this.findOne(id);
		const [product] = await this.db
			.update(schema.products)
			.set({ ...dto, updatedAt: new Date() })
			.where(eq(schema.products.id, id))
			.returning();
		return product;
	}

	async remove(id: string) {
		await this.findOne(id);
		await this.db.delete(schema.products).where(eq(schema.products.id, id));
	}
}
