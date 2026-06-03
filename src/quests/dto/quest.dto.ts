import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from "class-validator";

export const questTypes = ["diaria", "semanal", "unica"] as const;
export const questCategories = [
	"visitas",
	"vendas",
	"receita",
	"reativacao",
	"produto",
	"especial",
] as const;

export type QuestType = (typeof questTypes)[number];
export type QuestCategory = (typeof questCategories)[number];

export class CreateQuestDto {
	@ApiProperty() @IsString() @IsNotEmpty() title: string;
	@ApiProperty() @IsString() @IsNotEmpty() description: string;
	@ApiProperty({ enum: questTypes })
	@IsEnum(questTypes)
	type: QuestType;
	@ApiProperty({ enum: questCategories })
	@IsEnum(questCategories)
	category: QuestCategory;
	@ApiProperty() @IsNumber() @Min(1) target: number;
	@ApiProperty() @IsInt() @Min(0) xpReward: number;
	@ApiProperty() @IsString() @IsNotEmpty() icon: string;
	@ApiPropertyOptional() @IsOptional() @IsBoolean() active?: boolean;
	@ApiProperty() @IsDateString() startDate: string;
	@ApiProperty() @IsDateString() endDate: string;
	@ApiPropertyOptional() @IsOptional() @IsBoolean() assignedToAll?: boolean;
	@ApiPropertyOptional({ type: [String] })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	vendorIds?: string[];
}

export class UpdateQuestDto extends PartialType(CreateQuestDto) {}

export class UpdateQuestProgressDto {
	@ApiProperty() @IsString() @IsNotEmpty() vendorId: string;
	@ApiProperty() @IsNumber() @Min(0) current: number;
	@ApiPropertyOptional() @IsOptional() @IsBoolean() completed?: boolean;
	@ApiPropertyOptional() @IsOptional() @IsDateString() completedAt?: string;
}
