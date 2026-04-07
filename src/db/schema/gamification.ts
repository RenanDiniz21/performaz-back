import {
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";
import { xpActivityTypeEnum } from "./enums";
import { vendors } from "./vendors";

export const achievements = pgTable("achievements", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: varchar("name", { length: 100 }).notNull().unique(),
	description: text("description").notNull(),
	icon: varchar("icon", { length: 10 }).notNull(),
	xpReward: integer("xp_reward").notNull(),
	condition: text("condition").notNull(), // JSON string
});

export const vendorAchievements = pgTable(
	"vendor_achievements",
	{
		id: varchar("id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
		vendorId: varchar("vendor_id", { length: 36 })
			.notNull()
			.references(() => vendors.id),
		achievementId: varchar("achievement_id", { length: 36 })
			.notNull()
			.references(() => achievements.id),
	},
	(t) => [unique().on(t.vendorId, t.achievementId)],
);

export const xpActivities = pgTable("xp_activities", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	type: xpActivityTypeEnum("type").notNull(),
	description: text("description").notNull(),
	xpEarned: integer("xp_earned").notNull(),
	vendorId: varchar("vendor_id", { length: 36 })
		.notNull()
		.references(() => vendors.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
export type VendorAchievement = typeof vendorAchievements.$inferSelect;
export type XpActivity = typeof xpActivities.$inferSelect;
