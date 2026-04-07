"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendors = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enums_1 = require("./enums");
exports.vendors = (0, pg_core_1.pgTable)("vendors", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    matricula: (0, pg_core_1.varchar)("matricula", { length: 50 }).notNull().unique(),
    passwordHash: (0, pg_core_1.text)("password_hash").notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }).notNull(),
    avatar: (0, pg_core_1.text)("avatar"),
    status: (0, enums_1.vendorStatusEnum)("status").notNull().default("ativo"),
    region: (0, pg_core_1.text)("region").notNull(),
    xp: (0, pg_core_1.integer)("xp").notNull().default(0),
    level: (0, pg_core_1.integer)("level").notNull().default(1),
    totalSales: (0, pg_core_1.integer)("total_sales").notNull().default(0),
    totalRevenue: (0, pg_core_1.real)("total_revenue").notNull().default(0),
    goalsHit: (0, pg_core_1.integer)("goals_hit").notNull().default(0),
    goalsTotal: (0, pg_core_1.integer)("goals_total").notNull().default(0),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    loginAttempts: (0, pg_core_1.integer)("login_attempts").notNull().default(0),
    lockedUntil: (0, pg_core_1.timestamp)("locked_until"),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").notNull().defaultNow(),
    lastActive: (0, pg_core_1.timestamp)("last_active").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
//# sourceMappingURL=vendors.js.map