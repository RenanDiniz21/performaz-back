"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeClients = exports.routes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const clients_1 = require("./clients");
const enums_1 = require("./enums");
const vendors_1 = require("./vendors");
exports.routes = (0, pg_core_1.pgTable)("routes", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    date: (0, pg_core_1.timestamp)("date").notNull(),
    status: (0, enums_1.routeStatusEnum)("status").notNull().default("nao_iniciada"),
    totalClients: (0, pg_core_1.integer)("total_clients").notNull().default(0),
    visitedClients: (0, pg_core_1.integer)("visited_clients").notNull().default(0),
    salesMade: (0, pg_core_1.integer)("sales_made").notNull().default(0),
    vendorId: (0, pg_core_1.varchar)("vendor_id", { length: 36 })
        .notNull()
        .references(() => vendors_1.vendors.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.routeClients = (0, pg_core_1.pgTable)("route_clients", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    order: (0, pg_core_1.integer)("order").notNull(),
    status: (0, enums_1.clientStatusEnum)("status").notNull().default("pendente"),
    checkInTime: (0, pg_core_1.timestamp)("check_in_time"),
    visitReason: (0, enums_1.visitReasonEnum)("visit_reason"),
    routeId: (0, pg_core_1.varchar)("route_id", { length: 36 })
        .notNull()
        .references(() => exports.routes.id, { onDelete: "cascade" }),
    clientId: (0, pg_core_1.varchar)("client_id", { length: 36 })
        .notNull()
        .references(() => clients_1.clients.id),
}, (t) => [(0, pg_core_1.unique)().on(t.routeId, t.clientId)]);
//# sourceMappingURL=routes.js.map