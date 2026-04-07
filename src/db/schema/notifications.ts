import {
	boolean,
	pgTable,
	text,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";
import { notificationTypeEnum } from "./enums";
import { users } from "./users";
import { vendors } from "./vendors";

export const notifications = pgTable("notifications", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text("title").notNull(),
	message: text("message").notNull(),
	type: notificationTypeEnum("type").notNull(),
	targetAll: boolean("target_all").notNull().default(false),
	sentAt: timestamp("sent_at").notNull().defaultNow(),
	sentById: varchar("sent_by_id", { length: 36 }).references(() => users.id, {
		onDelete: "set null",
	}),
});

export const notificationRecipients = pgTable(
	"notification_recipients",
	{
		id: varchar("id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		readAt: timestamp("read_at"),
		notificationId: varchar("notification_id", { length: 36 })
			.notNull()
			.references(() => notifications.id, { onDelete: "cascade" }),
		vendorId: varchar("vendor_id", { length: 36 })
			.notNull()
			.references(() => vendors.id),
	},
	(t) => [unique().on(t.notificationId, t.vendorId)],
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type NotificationRecipient = typeof notificationRecipients.$inferSelect;
