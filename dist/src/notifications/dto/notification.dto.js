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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateNotificationDto {
    title;
    message;
    type;
    targetAll;
    targetVendorIds;
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["info", "achievement", "alert", "route"] }),
    (0, class_validator_1.IsEnum)(["info", "achievement", "alert", "route"]),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "true = enviar para todos os vendedores" }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateNotificationDto.prototype, "targetAll", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: "IDs dos vendedores alvo (quando targetAll=false)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateNotificationDto.prototype, "targetVendorIds", void 0);
//# sourceMappingURL=notification.dto.js.map