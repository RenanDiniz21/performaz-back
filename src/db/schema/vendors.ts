import {
	integer,
	pgTable,
	real,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { vendorStatusEnum } from "./enums";

export const vendors = pgTable("vendors", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	matricula: varchar("matricula", { length: 50 }).notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	phone: varchar("phone", { length: 20 }).notNull(),
	avatar: text("avatar"),
	status: vendorStatusEnum("status").notNull().default("ativo"),
	region: text("region").notNull(),
	xp: integer("xp").notNull().default(0),
	level: integer("level").notNull().default(1),
	totalSales: integer("total_sales").notNull().default(0),
	totalRevenue: real("total_revenue").notNull().default(0),
	goalsHit: integer("goals_hit").notNull().default(0),
	goalsTotal: integer("goals_total").notNull().default(0),
	refreshToken: text("refresh_token"),
	loginAttempts: integer("login_attempts").notNull().default(0),
	lockedUntil: timestamp("locked_until"),
	joinedAt: timestamp("joined_at").notNull().defaultNow(),
	lastActive: timestamp("last_active").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
