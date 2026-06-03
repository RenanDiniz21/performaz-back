import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
} from "class-validator";

export class CreateClientDto {
	@ApiProperty() @IsString() @IsNotEmpty() name: string;
	@ApiProperty() @IsString() @IsNotEmpty() cnpj: string;
	@ApiProperty() @IsString() @IsNotEmpty() address: string;
	@ApiProperty() @IsString() @IsNotEmpty() city: string;
	@ApiProperty() @IsString() @Length(2, 2) state: string;
	@ApiProperty() @IsString() @IsNotEmpty() phone: string;
	@ApiProperty() @IsEmail() email: string;
	@ApiProperty() @IsString() @IsNotEmpty() segment: string;
	@ApiPropertyOptional() @IsOptional() @IsNumber() latitude?: number;
	@ApiPropertyOptional() @IsOptional() @IsNumber() longitude?: number;
	@ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
	@ApiPropertyOptional() @IsOptional() @IsString() vendorId?: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}
