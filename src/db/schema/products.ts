import {
	boolean,
	integer,
	pgTable,
	real,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	code: varchar("code", { length: 20 }).notNull().unique(),
	name: text("name").notNull(),
	category: varchar("category", { length: 100 }).notNull(),
	unit: varchar("unit", { length: 50 }).notNull(),
	price: real("price").notNull(),
	stock: integer("stock").notNull().default(0),
	active: boolean("active").notNull().default(true),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
