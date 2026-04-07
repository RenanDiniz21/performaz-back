import { pgTable, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { goalPeriodEnum, goalTypeEnum } from "./enums";
import { vendors } from "./vendors";

export const goals = pgTable("goals", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	period: goalPeriodEnum("period").notNull(),
	type: goalTypeEnum("type").notNull(),
	target: real("target").notNull(),
	current: real("current").notNull().default(0),
	startDate: timestamp("start_date").notNull(),
	endDate: timestamp("end_date").notNull(),
	vendorId: varchar("vendor_id", { length: 36 })
		.notNull()
		.references(() => vendors.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
