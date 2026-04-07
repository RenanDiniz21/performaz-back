"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goals = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enums_1 = require("./enums");
const vendors_1 = require("./vendors");
exports.goals = (0, pg_core_1.pgTable)("goals", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    period: (0, enums_1.goalPeriodEnum)("period").notNull(),
    type: (0, enums_1.goalTypeEnum)("type").notNull(),
    target: (0, pg_core_1.real)("target").notNull(),
    current: (0, pg_core_1.real)("current").notNull().default(0),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    vendorId: (0, pg_core_1.varchar)("vendor_id", { length: 36 })
        .notNull()
        .references(() => vendors_1.vendors.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
//# sourceMappingURL=goals.js.map