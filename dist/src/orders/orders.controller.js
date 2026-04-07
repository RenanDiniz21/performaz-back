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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
class UpdateOrderStatusDto {
    status;
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["pendente", "confirmado", "cancelado"] }),
    (0, class_validator_1.IsEnum)(["pendente", "confirmado", "cancelado"]),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "status", void 0);
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    findAll(vendorId, clientId) {
        return this.ordersService.findAll(vendorId, clientId);
    }
    findOne(id) {
        return this.ordersService.findOne(id);
    }
    create(dto) {
        return this.ordersService.create(dto);
    }
    updateStatus(id, dto) {
        return this.ordersService.updateStatus(id, dto.status);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Listar pedidos" }),
    (0, swagger_1.ApiQuery)({ name: "vendorId", required: false }),
    (0, swagger_1.ApiQuery)({ name: "clientId", required: false }),
    __param(0, (0, common_1.Query)("vendorId")),
    __param(1, (0, common_1.Query)("clientId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Buscar pedido por ID (com itens)" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Criar pedido" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, swagger_1.ApiOperation)({ summary: "Atualizar status do pedido" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)("orders"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("orders"),
    __metadata("design:paramtypes", [Function])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map