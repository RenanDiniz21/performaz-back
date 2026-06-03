import {
	integer,
	pgTable,
	real,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { clientStatusEnum } from "./enums";
import { vendors } from "./vendors";

export const clients = pgTable("clients", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
	address: text("address").notNull(),
	city: varchar("city", { length: 100 }).notNull(),
	state: varchar("state", { length: 2 }).notNull(),
	phone: varchar("phone", { length: 20 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	segment: varchar("segment", { length: 100 }).notNull(),
	latitude: real("latitude"),
	longitude: real("longitude"),
	notes: text("notes"),
	status: clientStatusEnum("status").notNull().default("pendente"),
	totalOrders: integer("total_orders").notNull().default(0),
	totalRevenue: real("total_revenue").notNull().default(0),
	lastOrderDate: timestamp("last_order_date"),
	vendorId: varchar("vendor_id", { length: 36 }).references(() => vendors.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
