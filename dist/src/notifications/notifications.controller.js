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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    findAll() {
        return this.notificationsService.findAll();
    }
    findForVendor(vendorId) {
        return this.notificationsService.findForVendor(vendorId);
    }
    send(dto, user) {
        return this.notificationsService.send(dto, user.sub);
    }
    markRead(id, vendorId) {
        return this.notificationsService.markRead(id, vendorId);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Listar todas as notificações (gestor)" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("vendor/:vendorId"),
    (0, swagger_1.ApiOperation)({ summary: "Listar notificações de um vendedor específico" }),
    __param(0, (0, common_1.Param)("vendorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findForVendor", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Enviar notificação (broadcast ou específica)" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "send", null);
__decorate([
    (0, common_1.Patch)(":id/read/:vendorId"),
    (0, swagger_1.ApiOperation)({ summary: "Marcar notificação como lida" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("vendorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markRead", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)("notifications"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("notifications"),
    __metadata("design:paramtypes", [Function])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map