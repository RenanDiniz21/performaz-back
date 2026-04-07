"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorLocations = exports.checkIns = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const clients_1 = require("./clients");
const vendors_1 = require("./vendors");
exports.checkIns = (0, pg_core_1.pgTable)("check_ins", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    lat: (0, pg_core_1.doublePrecision)("lat"),
    lng: (0, pg_core_1.doublePrecision)("lng"),
    photoUrl: (0, pg_core_1.text)("photo_url"),
    notes: (0, pg_core_1.text)("notes"),
    vendorId: (0, pg_core_1.varchar)("vendor_id", { length: 36 })
        .notNull()
        .references(() => vendors_1.vendors.id),
    clientId: (0, pg_core_1.varchar)("client_id", { length: 36 })
        .notNull()
        .references(() => clients_1.clients.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.vendorLocations = (0, pg_core_1.pgTable)("vendor_locations", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    lat: (0, pg_core_1.doublePrecision)("lat").notNull(),
    lng: (0, pg_core_1.doublePrecision)("lng").notNull(),
    vendorId: (0, pg_core_1.varchar)("vendor_id", { length: 36 })
        .notNull()
        .unique()
        .references(() => vendors_1.vendors.id),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
//# sourceMappingURL=checkins.js.map