import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from "class-validator";

export class CreateProductDto {
	@ApiProperty() @IsString() @IsNotEmpty() code: string;
	@ApiProperty() @IsString() @IsNotEmpty() name: string;
	@ApiProperty() @IsString() @IsNotEmpty() category: string;
	@ApiProperty() @IsString() @IsNotEmpty() unit: string;
	@ApiProperty() @IsNumber() @Min(0) price: number;
	@ApiProperty() @IsNumber() @Min(0) stock: number;
	@ApiPropertyOptional() @IsOptional() @IsBoolean() active?: boolean;
	@ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
