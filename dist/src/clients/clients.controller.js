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
exports.ClientsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ClientsController = class ClientsController {
    clientsService;
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    findAll(search) {
        return this.clientsService.findAll(search);
    }
    findOne(id) {
        return this.clientsService.findOne(id);
    }
    create(dto) {
        return this.clientsService.create(dto);
    }
    update(id, dto) {
        return this.clientsService.update(id, dto);
    }
    remove(id) {
        return this.clientsService.remove(id);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Listar clientes (com busca por nome ou CNPJ)" }),
    (0, swagger_1.ApiQuery)({ name: "search", required: false }),
    __param(0, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Buscar cliente por ID" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Criar cliente" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Atualizar cliente" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: "Remover cliente" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "remove", null);
exports.ClientsController = ClientsController = __decorate([
    (0, swagger_1.ApiTags)("clients"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("clients"),
    __metadata("design:paramtypes", [Function])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map