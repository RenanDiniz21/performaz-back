"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xpActivityTypeEnum = exports.notificationTypeEnum = exports.goalTypeEnum = exports.goalPeriodEnum = exports.visitReasonEnum = exports.routeStatusEnum = exports.orderStatusEnum = exports.clientStatusEnum = exports.vendorStatusEnum = exports.userRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userRoleEnum = (0, pg_core_1.pgEnum)("user_role", ["GESTOR", "VENDEDOR"]);
exports.vendorStatusEnum = (0, pg_core_1.pgEnum)("vendor_status", [
    "ativo",
    "inativo",
    "ferias",
]);
exports.clientStatusEnum = (0, pg_core_1.pgEnum)("client_status", [
    "pendente",
    "visitado",
    "venda_realizada",
    "sem_venda",
]);
exports.orderStatusEnum = (0, pg_core_1.pgEnum)("order_status", [
    "pendente",
    "confirmado",
    "cancelado",
]);
exports.routeStatusEnum = (0, pg_core_1.pgEnum)("route_status", [
    "nao_iniciada",
    "em_andamento",
    "concluida",
]);
exports.visitReasonEnum = (0, pg_core_1.pgEnum)("visit_reason", [
    "cliente_fechado",
    "sem_interesse",
    "vai_comprar_depois",
]);
exports.goalPeriodEnum = (0, pg_core_1.pgEnum)("goal_period", [
    "diario",
    "semanal",
    "mensal",
]);
exports.goalTypeEnum = (0, pg_core_1.pgEnum)("goal_type", [
    "receita",
    "vendas",
    "visitas",
]);
exports.notificationTypeEnum = (0, pg_core_1.pgEnum)("notification_type", [
    "info",
    "achievement",
    "alert",
    "route",
]);
exports.xpActivityTypeEnum = (0, pg_core_1.pgEnum)("xp_activity_type", [
    "checkin",
    "venda",
    "meta_atingida",
    "conquista",
]);
//# sourceMappingURL=enums.js.map