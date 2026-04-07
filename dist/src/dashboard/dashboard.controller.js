"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    kpis() {
        return this.dashboardService.getKPIs();
    }
    revenue(days) {
        return this.dashboardService.getDailyRevenue(days ? Number(days) : 10);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)("kpis"),
    (0, swagger_1.ApiOperation)({ summary: "KPIs principais do painel do gestor" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "kpis", null);
__decorate([
    (0, common_1.Get)("revenue"),
    (0, swagger_1.ApiOperation)({ summary: "Receita diária dos últimos N dias" }),
    (0, swagger_1.ApiQuery)({ name: "days", required: false, type: Number }),
    __param(0, (0, common_1.Query)("days")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "revenue", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)("dashboard"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("dashboard"),
    __metadata("design:paramtypes", [Function])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map