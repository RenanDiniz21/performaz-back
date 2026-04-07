"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enums_1 = require("./enums");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.text)("password_hash").notNull(),
    role: (0, enums_1.userRoleEnum)("role").notNull().default("GESTOR"),
    avatar: (0, pg_core_1.text)("avatar"),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    loginAttempts: (0, pg_core_1.integer)("login_attempts").notNull().default(0),
    lockedUntil: (0, pg_core_1.timestamp)("locked_until"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
//# sourceMappingURL=users.js.map