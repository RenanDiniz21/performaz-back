import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

export class CreateNotificationDto {
	@ApiProperty() @IsString() @IsNotEmpty() title: string;
	@ApiProperty() @IsString() @IsNotEmpty() message: string;
	@ApiProperty({ enum: ["info", "achievement", "alert", "route"] })
	@IsEnum(["info", "achievement", "alert", "route"])
	type: "info" | "achievement" | "alert" | "route";

	@ApiProperty({ description: "true = enviar para todos os vendedores" })
	@IsBoolean()
	targetAll: boolean;

	@ApiPropertyOptional({
		type: [String],
		description: "IDs dos vendedores alvo (quando targetAll=false)",
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	targetVendorIds?: string[];
}
