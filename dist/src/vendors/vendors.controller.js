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
exports.VendorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let VendorsController = class VendorsController {
    vendorsService;
    constructor(vendorsService) {
        this.vendorsService = vendorsService;
    }
    findAll() {
        return this.vendorsService.findAll();
    }
    findOne(id) {
        return this.vendorsService.findOne(id);
    }
    create(dto) {
        return this.vendorsService.create(dto);
    }
    update(id, dto) {
        return this.vendorsService.update(id, dto);
    }
    updateStatus(id, dto) {
        return this.vendorsService.updateStatus(id, dto);
    }
    remove(id) {
        return this.vendorsService.remove(id);
    }
};
exports.VendorsController = VendorsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Listar todos os vendedores" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Buscar vendedor por ID" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Criar vendedor" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Atualizar vendedor" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, swagger_1.ApiOperation)({ summary: "Atualizar status do vendedor" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: "Remover vendedor" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "remove", null);
exports.VendorsController = VendorsController = __decorate([
    (0, swagger_1.ApiTags)("vendors"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("vendors"),
    __metadata("design:paramtypes", [Function])
], VendorsController);
//# sourceMappingURL=vendors.controller.js.map