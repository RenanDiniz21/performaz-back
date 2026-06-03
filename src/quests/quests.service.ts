import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";
import type {
	CreateQuestDto,
	UpdateQuestDto,
	UpdateQuestProgressDto,
} from "./dto/quest.dto";

@Injectable()
export class QuestsService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async findAll() {
		const quests = await this.db.select().from(schema.quests);
		const progress = await this.findProgress();
		return quests.map((quest) => ({
			...quest,
			progress: progress.filter((row) => row.questId === quest.id),
		}));
	}

	async findOne(id: string) {
		const [quest] = await this.db
			.select()
			.from(schema.quests)
			.where(eq(schema.quests.id, id));
		if (!quest) throw new NotFoundException("Missao nao encontrada");

		const progress = await this.findProgress(id);
		return { ...quest, progress };
	}

	async create(dto: CreateQuestDto) {
		const assignedToAll = dto.assignedToAll ?? true;
		const [quest] = await this.db
			.insert(schema.quests)
			.values({
				title: dto.title,
				description: dto.description,
				type: dto.type,
				category: dto.category,
				target: dto.target,
				xpReward: dto.xpReward,
				icon: dto.icon,
				active: dto.active ?? true,
				startDate: new Date(dto.startDate),
				endDate: new Date(dto.endDate),
				assignedToAll,
			})
			.returning();

		const vendorIds = await this.resolveVendorIds(assignedToAll, dto.vendorIds);
		await this.assignVendors(quest.id, vendorIds);
		return this.findOne(quest.id);
	}

	async update(id: string, dto: UpdateQuestDto) {
		await this.findOne(id);
		const updates: Record<string, unknown> = { updatedAt: new Date() };
		const fields = [
			"title",
			"description",
			"type",
			"category",
			"target",
			"xpReward",
			"icon",
			"active",
			"assignedToAll",
		] as const;

		for (const field of fields) {
			if (dto[field] !== undefined) updates[field] = dto[field];
		}
		if (dto.startDate) updates.startDate = new Date(dto.startDate);
		if (dto.endDate) updates.endDate = new Date(dto.endDate);

		await this.db.update(schema.quests).set(updates).where(eq(schema.quests.id, id));

		if (dto.assignedToAll !== undefined || dto.vendorIds !== undefined) {
			const assignedToAll = dto.assignedToAll ?? false;
			const vendorIds = await this.resolveVendorIds(assignedToAll, dto.vendorIds);
			await this.replaceAssignments(id, vendorIds);
		}

		return this.findOne(id);
	}

	async updateProgress(id: string, dto: UpdateQuestProgressDto) {
		await this.findOne(id);
		const [progress] = await this.db
			.update(schema.questProgress)
			.set({
				current: dto.current,
				completed: dto.completed ?? dto.current > 0,
				completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
			})
			.where(
				and(
					eq(schema.questProgress.questId, id),
					eq(schema.questProgress.vendorId, dto.vendorId),
				),
			)
			.returning();
		if (!progress) throw new NotFoundException("Progresso nao encontrado");
		return this.findOne(id);
	}

	async remove(id: string) {
		await this.findOne(id);
		await this.db.delete(schema.quests).where(eq(schema.quests.id, id));
	}

	private async findProgress(questId?: string) {
		const rows = await this.db
			.select({
				id: schema.questProgress.id,
				questId: schema.questProgress.questId,
				vendorId: schema.questProgress.vendorId,
				vendorName: schema.vendors.name,
				current: schema.questProgress.current,
				completed: schema.questProgress.completed,
				completedAt: schema.questProgress.completedAt,
			})
			.from(schema.questProgress)
			.leftJoin(schema.vendors, eq(schema.questProgress.vendorId, schema.vendors.id));

		return rows
			.filter((row) => !questId || row.questId === questId)
			.map((row) => ({
				...row,
				vendorName: row.vendorName ?? "Vendedor",
			}));
	}

	private async resolveVendorIds(assignedToAll: boolean, vendorIds?: string[]) {
		if (!assignedToAll) return vendorIds ?? [];

		const vendors = await this.db
			.select({ id: schema.vendors.id })
			.from(schema.vendors)
			.where(eq(schema.vendors.status, "ativo"));
		return vendors.map((vendor) => vendor.id);
	}

	private async assignVendors(questId: string, vendorIds: string[]) {
		if (!vendorIds.length) return;
		await this.db
			.insert(schema.questProgress)
			.values(vendorIds.map((vendorId) => ({ questId, vendorId })))
			.onConflictDoNothing();
	}

	private async replaceAssignments(questId: string, vendorIds: string[]) {
		await this.db
			.delete(schema.questProgress)
			.where(eq(schema.questProgress.questId, questId));
		await this.assignVendors(questId, vendorIds);
	}
}
