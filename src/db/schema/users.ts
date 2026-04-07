import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums";

export const users = pgTable("users", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	role: userRoleEnum("role").notNull().default("GESTOR"),
	avatar: text("avatar"),
	refreshToken: text("refresh_token"),
	loginAttempts: integer("login_attempts").notNull().default(0),
	lockedUntil: timestamp("locked_until"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
