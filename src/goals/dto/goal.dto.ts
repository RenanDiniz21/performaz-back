import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
	Min,
} from "class-validator";

export class CreateGoalDto {
	@ApiProperty() @IsString() @IsNotEmpty() vendorId: string;
	@ApiProperty({ enum: ["diario", "semanal", "mensal"] })
	@IsEnum(["diario", "semanal", "mensal"])
	period: "diario" | "semanal" | "mensal";
	@ApiProperty({ enum: ["receita", "vendas", "visitas"] })
	@IsEnum(["receita", "vendas", "visitas"])
	type: "receita" | "vendas" | "visitas";
	@ApiProperty() @IsNumber() @Min(1) target: number;
	@ApiProperty() @IsDateString() startDate: string;
	@ApiProperty() @IsDateString() endDate: string;
}

export class UpdateGoalDto extends PartialType(CreateGoalDto) {}
