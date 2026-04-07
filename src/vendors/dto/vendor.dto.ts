import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from "class-validator";

export class CreateVendorDto {
	@ApiProperty() @IsString() @IsNotEmpty() name: string;
	@ApiProperty() @IsEmail() email: string;
	@ApiProperty() @IsString() @IsNotEmpty() matricula: string;
	@ApiProperty() @IsString() @MinLength(6) password: string;
	@ApiProperty() @IsString() @IsNotEmpty() phone: string;
	@ApiProperty() @IsString() @IsNotEmpty() region: string;
	@ApiPropertyOptional() @IsOptional() @IsString() avatar?: string;
}

export class UpdateVendorDto extends PartialType(CreateVendorDto) {}

export class UpdateVendorStatusDto {
	@ApiProperty({ enum: ["ativo", "inativo", "ferias"] })
	@IsEnum(["ativo", "inativo", "ferias"])
	status: "ativo" | "inativo" | "ferias";
}
