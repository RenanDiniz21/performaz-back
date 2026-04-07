import {
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { clientStatusEnum, routeStatusEnum, visitReasonEnum } from "./enums";
import { vendors } from "./vendors";

export const routes = pgTable("routes", {
	id: varchar("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	date: timestamp("date").notNull(),
	status: routeStatusEnum("status").notNull().default("nao_iniciada"),
	totalClients: integer("total_clients").notNull().default(0),
	visitedClients: integer("visited_clients").notNull().default(0),
	salesMade: integer("sales_made").notNull().default(0),
	vendorId: varchar("vendor_id", { length: 36 })
		.notNull()
		.references(() => vendors.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const routeClients = pgTable(
	"route_clients",
	{
		id: varchar("id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		order: integer("order").notNull(),
		status: clientStatusEnum("status").notNull().default("pendente"),
		checkInTime: timestamp("check_in_time"),
		visitReason: visitReasonEnum("visit_reason"),
		routeId: varchar("route_id", { length: 36 })
			.notNull()
			.references(() => routes.id, { onDelete: "cascade" }),
		clientId: varchar("client_id", { length: 36 })
			.notNull()
			.references(() => clients.id),
	},
	(t) => [unique().on(t.routeId, t.clientId)],
);

export type Route = typeof routes.$inferSelect;
export type NewRoute = typeof routes.$inferInsert;
export type RouteClient = typeof routeClients.$inferSelect;
export type NewRouteClient = typeof routeClients.$inferInsert;
