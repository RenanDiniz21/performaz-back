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
exports.UpdateGoalDto = exports.CreateGoalDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateGoalDto {
    vendorId;
    period;
    type;
    target;
    startDate;
    endDate;
}
exports.CreateGoalDto = CreateGoalDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGoalDto.prototype, "vendorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["diario", "semanal", "mensal"] }),
    (0, class_validator_1.IsEnum)(["diario", "semanal", "mensal"]),
    __metadata("design:type", String)
], CreateGoalDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["receita", "vendas", "visitas"] }),
    (0, class_validator_1.IsEnum)(["receita", "vendas", "visitas"]),
    __metadata("design:type", String)
], CreateGoalDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateGoalDto.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateGoalDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateGoalDto.prototype, "endDate", void 0);
class UpdateGoalDto extends (0, swagger_1.PartialType)(CreateGoalDto) {
}
exports.UpdateGoalDto = UpdateGoalDto;
//# sourceMappingURL=goal.dto.js.map