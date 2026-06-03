import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["GESTOR", "VENDEDOR"]);
export const vendorStatusEnum = pgEnum("vendor_status", [
	"ativo",
	"inativo",
	"ferias",
]);
export const clientStatusEnum = pgEnum("client_status", [
	"pendente",
	"visitado",
	"venda_realizada",
	"sem_venda",
]);
export const orderStatusEnum = pgEnum("order_status", [
	"pendente",
	"confirmado",
	"cancelado",
]);
export const routeStatusEnum = pgEnum("route_status", [
	"nao_iniciada",
	"em_andamento",
	"concluida",
]);
export const visitReasonEnum = pgEnum("visit_reason", [
	"cliente_fechado",
	"sem_interesse",
	"vai_comprar_depois",
]);
export const goalPeriodEnum = pgEnum("goal_period", [
	"diario",
	"semanal",
	"mensal",
]);
export const goalTypeEnum = pgEnum("goal_type", [
	"receita",
	"vendas",
	"visitas",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
	"info",
	"achievement",
	"alert",
	"route",
]);
export const questTypeEnum = pgEnum("quest_type", [
	"diaria",
	"semanal",
	"unica",
]);
export const questCategoryEnum = pgEnum("quest_category", [
	"visitas",
	"vendas",
	"receita",
	"reativacao",
	"produto",
	"especial",
]);
export const xpActivityTypeEnum = pgEnum("xp_activity_type", [
	"checkin",
	"venda",
	"meta_atingida",
	"conquista",
]);
