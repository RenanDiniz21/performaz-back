import {
	integer,
	pgTable,
	real,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { orderStatusEnum } from "./enums";
import { products } from "./products";
import { vendors } from "./vendors";

export const orders = pgTable("orders", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	total: real("total").notNull(),
	status: orderStatusEnum("status").notNull().default("pendente"),
	notes: text("notes"),
	vendorId: varchar("vendor_id", { length: 36 })
		.notNull()
		.references(() => vendors.id),
	clientId: varchar("client_id", { length: 36 })
		.notNull()
		.references(() => clients.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	quantity: integer("quantity").notNull(),
	unitPrice: real("unit_price").notNull(),
	subtotal: real("subtotal").notNull(),
	orderId: varchar("order_id", { length: 36 })
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	productId: varchar("product_id", { length: 36 })
		.notNull()
		.references(() => products.id),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
