import {
	doublePrecision,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { vendors } from "./vendors";

export const checkIns = pgTable("check_ins", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	lat: doublePrecision("lat"),
	lng: doublePrecision("lng"),
	photoUrl: text("photo_url"),
	notes: text("notes"),
	vendorId: varchar("vendor_id", { length: 36 })
		.notNull()
		.references(() => vendors.id),
	clientId: varchar("client_id", { length: 36 })
		.notNull()
		.references(() => clients.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const vendorLocations = pgTable("vendor_locations", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	lat: doublePrecision("lat").notNull(),
	lng: doublePrecision("lng").notNull(),
	vendorId: varchar("vendor_id", { length: 36 })
		.notNull()
		.unique()
		.references(() => vendors.id),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CheckIn = typeof checkIns.$inferSelect;
export type NewCheckIn = typeof checkIns.$inferInsert;
