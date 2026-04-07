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
import type { CreateClientDto, UpdateClientDto } from "./dto/client.dto";

@Injectable()
export class ClientsService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async findAll(search?: string) {
		if (search) {
			return this.db
				.select()
				.from(schema.clients)
				.where(
					or(
						ilike(schema.clients.name, `%${search}%`),
						ilike(schema.clients.cnpj, `%${search}%`),
					),
				);
		}
		return this.db.select().from(schema.clients);
	}

	async findOne(id: string) {
		const [client] = await this.db
			.select()
			.from(schema.clients)
			.where(eq(schema.clients.id, id));
		if (!client) throw new NotFoundException("Cliente não encontrado");
		return client;
	}

	async create(dto: CreateClientDto) {
		const exists = await this.db
			.select({ id: schema.clients.id })
			.from(schema.clients)
			.where(eq(schema.clients.cnpj, dto.cnpj));
		if (exists.length) throw new ConflictException("CNPJ já cadastrado");
		const [client] = await this.db
			.insert(schema.clients)
			.values(dto)
			.returning();
		return client;
	}

	async update(id: string, dto: UpdateClientDto) {
		await this.findOne(id);
		const [client] = await this.db
			.update(schema.clients)
			.set({ ...dto, updatedAt: new Date() })
			.where(eq(schema.clients.id, id))
			.returning();
		return client;
	}

	async remove(id: string) {
		await this.findOne(id);
		await this.db.delete(schema.clients).where(eq(schema.clients.id, id));
	}
}
