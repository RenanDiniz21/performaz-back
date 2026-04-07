"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xpActivities = exports.vendorAchievements = exports.achievements = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enums_1 = require("./enums");
const vendors_1 = require("./vendors");
exports.achievements = (0, pg_core_1.pgTable)("achievements", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull().unique(),
    description: (0, pg_core_1.text)("description").notNull(),
    icon: (0, pg_core_1.varchar)("icon", { length: 10 }).notNull(),
    xpReward: (0, pg_core_1.integer)("xp_reward").notNull(),
    condition: (0, pg_core_1.text)("condition").notNull(),
});
exports.vendorAchievements = (0, pg_core_1.pgTable)("vendor_achievements", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    unlockedAt: (0, pg_core_1.timestamp)("unlocked_at").notNull().defaultNow(),
    vendorId: (0, pg_core_1.varchar)("vendor_id", { length: 36 })
        .notNull()
        .references(() => vendors_1.vendors.id),
    achievementId: (0, pg_core_1.varchar)("achievement_id", { length: 36 })
        .notNull()
        .references(() => exports.achievements.id),
}, (t) => [(0, pg_core_1.unique)().on(t.vendorId, t.achievementId)]);
exports.xpActivities = (0, pg_core_1.pgTable)("xp_activities", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    type: (0, enums_1.xpActivityTypeEnum)("type").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    xpEarned: (0, pg_core_1.integer)("xp_earned").notNull(),
    vendorId: (0, pg_core_1.varchar)("vendor_id", { length: 36 })
        .notNull()
        .references(() => vendors_1.vendors.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
//# sourceMappingURL=gamification.js.map