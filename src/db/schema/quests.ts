import {
	boolean,
	integer,
	pgTable,
	real,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";
import { questCategoryEnum, questTypeEnum } from "./enums";
import { vendors } from "./vendors";

export const quests = pgTable("quests", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text("title").notNull(),
	description: text("description").notNull(),
	type: questTypeEnum("type").notNull(),
	category: questCategoryEnum("category").notNull(),
	target: real("target").notNull(),
	xpReward: integer("xp_reward").notNull(),
	icon: text("icon").notNull(),
	active: boolean("active").notNull().default(true),
	startDate: timestamp("start_date").notNull(),
	endDate: timestamp("end_date").notNull(),
	assignedToAll: boolean("assigned_to_all").notNull().default(true),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const questProgress = pgTable(
	"quest_progress",
	{
		id: varchar("id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		questId: varchar("quest_id", { length: 36 })
			.notNull()
			.references(() => quests.id, { onDelete: "cascade" }),
		vendorId: varchar("vendor_id", { length: 36 })
			.notNull()
			.references(() => vendors.id, { onDelete: "cascade" }),
		current: real("current").notNull().default(0),
		completed: boolean("completed").notNull().default(false),
		completedAt: timestamp("completed_at"),
	},
	(table) => ({
		questVendorUnique: uniqueIndex("quest_progress_quest_vendor_idx").on(
			table.questId,
			table.vendorId,
		),
	}),
);

export type Quest = typeof quests.$inferSelect;
export type NewQuest = typeof quests.$inferInsert;
export type QuestProgress = typeof questProgress.$inferSelect;
export type NewQuestProgress = typeof questProgress.$inferInsert;
