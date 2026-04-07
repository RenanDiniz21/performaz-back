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
exports.RoutesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RoutesController = class RoutesController {
    routesService;
    constructor(routesService) {
        this.routesService = routesService;
    }
    findAll(vendorId, date) {
        return this.routesService.findAll(vendorId, date);
    }
    findOne(id) {
        return this.routesService.findOne(id);
    }
    create(dto) {
        return this.routesService.create(dto);
    }
    checkIn(id, dto) {
        return this.routesService.checkIn(id, dto);
    }
    noSale(id, dto) {
        return this.routesService.registerNoSale(id, dto);
    }
    reorder(id, clients) {
        return this.routesService.updateClientOrder(id, clients);
    }
};
exports.RoutesController = RoutesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Listar rotas" }),
    (0, swagger_1.ApiQuery)({ name: "vendorId", required: false }),
    (0, swagger_1.ApiQuery)({ name: "date", required: false, description: "YYYY-MM-DD" }),
    __param(0, (0, common_1.Query)("vendorId")),
    __param(1, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Buscar rota por ID (com clientes)" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Criar rota" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(":id/checkin"),
    (0, swagger_1.ApiOperation)({ summary: "Fazer check-in em um cliente da rota (ganha XP)" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)(":id/no-sale"),
    (0, swagger_1.ApiOperation)({ summary: "Registrar visita sem venda" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "noSale", null);
__decorate([
    (0, common_1.Patch)(":id/reorder"),
    (0, swagger_1.ApiOperation)({ summary: "Reordenar clientes da rota" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "reorder", null);
exports.RoutesController = RoutesController = __decorate([
    (0, swagger_1.ApiTags)("routes"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("routes"),
    __metadata("design:paramtypes", [Function])
], RoutesController);
//# sourceMappingURL=routes.controller.js.map