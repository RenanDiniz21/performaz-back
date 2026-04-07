"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.varchar)("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    code: (0, pg_core_1.varchar)("code", { length: 20 }).notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 100 }).notNull(),
    unit: (0, pg_core_1.varchar)("unit", { length: 50 }).notNull(),
    price: (0, pg_core_1.real)("price").notNull(),
    stock: (0, pg_core_1.integer)("stock").notNull().default(0),
    active: (0, pg_core_1.boolean)("active").notNull().default(true),
    imageUrl: (0, pg_core_1.text)("image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
//# sourceMappingURL=products.js.map