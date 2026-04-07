"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItems = exports.orders = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const clients_1 = require("./clients");
const enums_1 = require("./enums");
const products_1 = require("./products");
const vendors_1 = require("./vendors");
exports.orders = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    total: (0, pg_core_1.real)("total").notNull(),
    status: (0, enums_1.orderStatusEnum)("status").notNull().default("pendente"),
    notes: (0, pg_core_1.text)("notes"),
    vendorId: (0, pg_core_1.varchar)("vendor_id", { length: 36 })
        .notNull()
        .references(() => vendors_1.vendors.id),
    clientId: (0, pg_core_1.varchar)("client_id", { length: 36 })
        .notNull()
        .references(() => clients_1.clients.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.orderItems = (0, pg_core_1.pgTable)("order_items", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    unitPrice: (0, pg_core_1.real)("unit_price").notNull(),
    subtotal: (0, pg_core_1.real)("subtotal").notNull(),
    orderId: (0, pg_core_1.varchar)("order_id", { length: 36 })
        .notNull()
        .references(() => exports.orders.id, { onDelete: "cascade" }),
    productId: (0, pg_core_1.varchar)("product_id", { length: 36 })
        .notNull()
        .references(() => products_1.products.id),
});
//# sourceMappingURL=orders.js.map