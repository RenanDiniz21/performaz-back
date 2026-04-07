"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRecipients = exports.notifications = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enums_1 = require("./enums");
const users_1 = require("./users");
const vendors_1 = require("./vendors");
exports.notifications = (0, pg_core_1.pgTable)("notifications", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    title: (0, pg_core_1.text)("title").notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
    type: (0, enums_1.notificationTypeEnum)("type").notNull(),
    targetAll: (0, pg_core_1.boolean)("target_all").notNull().default(false),
    sentAt: (0, pg_core_1.timestamp)("sent_at").notNull().defaultNow(),
    sentById: (0, pg_core_1.varchar)("sent_by_id", { length: 36 }).references(() => users_1.users.id, {
        onDelete: "set null",
    }),
});
exports.notificationRecipients = (0, pg_core_1.pgTable)("notification_recipients", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    readAt: (0, pg_core_1.timestamp)("read_at"),
    notificationId: (0, pg_core_1.varchar)("notification_id", { length: 36 })
        .notNull()
        .references(() => exports.notifications.id, { onDelete: "cascade" }),
    vendorId: (0, pg_core_1.varchar)("vendor_id", { length: 36 })
        .notNull()
        .references(() => vendors_1.vendors.id),
}, (t) => [(0, pg_core_1.unique)().on(t.notificationId, t.vendorId)]);
//# sourceMappingURL=notifications.js.map