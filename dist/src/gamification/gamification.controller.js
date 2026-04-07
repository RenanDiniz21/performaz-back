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
exports.GamificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
class UpdateLocationDto {
    lat;
    lng;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLocationDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLocationDto.prototype, "lng", void 0);
let GamificationController = class GamificationController {
    gamificationService;
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    leaderboard(metric = "xp", period = "mensal") {
        return this.gamificationService.getLeaderboard(metric, period);
    }
    achievements() {
        return this.gamificationService.getAllAchievements();
    }
    stats(vendorId) {
        return this.gamificationService.getVendorStats(vendorId);
    }
    map() {
        return this.gamificationService.getAllVendorLocations();
    }
    updateLocation(vendorId, dto) {
        return this.gamificationService.updateVendorLocation(vendorId, dto.lat, dto.lng);
    }
};
exports.GamificationController = GamificationController;
__decorate([
    (0, common_1.Get)("leaderboard"),
    (0, swagger_1.ApiOperation)({ summary: "Ranking de vendedores" }),
    (0, swagger_1.ApiQuery)({ name: "metric", required: false, enum: ["xp", "revenue"] }),
    (0, swagger_1.ApiQuery)({
        name: "period",
        required: false,
        enum: ["diario", "semanal", "mensal"],
    }),
    __param(0, (0, common_1.Query)("metric")),
    __param(1, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "leaderboard", null);
__decorate([
    (0, common_1.Get)("achievements"),
    (0, swagger_1.ApiOperation)({ summary: "Listar todas as conquistas disponíveis" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "achievements", null);
__decorate([
    (0, common_1.Get)("vendors/:vendorId/stats"),
    (0, swagger_1.ApiOperation)({ summary: "Estatísticas de gamificação de um vendedor" }),
    __param(0, (0, common_1.Param)("vendorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)("map"),
    (0, swagger_1.ApiOperation)({
        summary: "Localização em tempo real de todos os vendedores (mapa)",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "map", null);
__decorate([
    (0, common_1.Post)("vendors/:vendorId/location"),
    (0, swagger_1.ApiOperation)({ summary: "Atualizar localização do vendedor" }),
    __param(0, (0, common_1.Param)("vendorId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLocationDto]),
    __metadata("design:returntype", void 0)
], GamificationController.prototype, "updateLocation", null);
exports.GamificationController = GamificationController = __decorate([
    (0, swagger_1.ApiTags)("gamification"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("gamification"),
    __metadata("design:paramtypes", [Function])
], GamificationController);
//# sourceMappingURL=gamification.controller.js.map