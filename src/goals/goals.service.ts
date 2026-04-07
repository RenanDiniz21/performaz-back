import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";
import type { CreateGoalDto, UpdateGoalDto } from "./dto/goal.dto";

@Injectable()
export class GoalsService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async findAll(vendorId?: string) {
		const rows = await this.db.select().from(schema.goals);
		return vendorId ? rows.filter((g) => g.vendorId === vendorId) : rows;
	}

	async findOne(id: string) {
		const [goal] = await this.db
			.select()
			.from(schema.goals)
			.where(eq(schema.goals.id, id));
		if (!goal) throw new NotFoundException("Meta não encontrada");
		return goal;
	}

	async create(dto: CreateGoalDto) {
		const [goal] = await this.db
			.insert(schema.goals)
			.values({
				...dto,
				startDate: new Date(dto.startDate),
				endDate: new Date(dto.endDate),
			})
			.returning();
		return goal;
	}

	async update(id: string, dto: UpdateGoalDto) {
		await this.findOne(id);
		const updates: Record<string, unknown> = { ...dto, updatedAt: new Date() };
		if (dto.startDate) updates.startDate = new Date(dto.startDate);
		if (dto.endDate) updates.endDate = new Date(dto.endDate);
		const [goal] = await this.db
			.update(schema.goals)
			.set(updates)
			.where(eq(schema.goals.id, id))
			.returning();
		return goal;
	}

	async remove(id: string) {
		await this.findOne(id);
		await this.db.delete(schema.goals).where(eq(schema.goals.id, id));
	}
}
