"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clients = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enums_1 = require("./enums");
const vendors_1 = require("./vendors");
exports.clients = (0, pg_core_1.pgTable)("clients", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: (0, pg_core_1.text)("name").notNull(),
    cnpj: (0, pg_core_1.varchar)("cnpj", { length: 18 }).notNull().unique(),
    address: (0, pg_core_1.text)("address").notNull(),
    city: (0, pg_core_1.varchar)("city", { length: 100 }).notNull(),
    state: (0, pg_core_1.varchar)("state", { length: 2 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    segment: (0, pg_core_1.varchar)("segment", { length: 100 }).notNull(),
    notes: (0, pg_core_1.text)("notes"),
    status: (0, enums_1.clientStatusEnum)("status").notNull().default("pendente"),
    totalOrders: (0, pg_core_1.integer)("total_orders").notNull().default(0),
    totalRevenue: (0, pg_core_1.real)("total_revenue").notNull().default(0),
    lastOrderDate: (0, pg_core_1.timestamp)("last_order_date"),
    vendorId: (0, pg_core_1.varchar)("vendor_id", { length: 36 }).references(() => vendors_1.vendors.id, {
        onDelete: "set null",
    }),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
//# sourceMappingURL=clients.js.map