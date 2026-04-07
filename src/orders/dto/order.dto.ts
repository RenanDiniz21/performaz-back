import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from "class-validator";

export class CreateOrderItemDto {
	@ApiProperty() @IsString() @IsNotEmpty() productId: string;
	@ApiProperty() @IsNumber() @Min(1) quantity: number;
	@ApiProperty() @IsNumber() @Min(0) unitPrice: number;
}

export class CreateOrderDto {
	@ApiProperty() @IsString() @IsNotEmpty() vendorId: string;
	@ApiProperty() @IsString() @IsNotEmpty() clientId: string;
	@ApiPropertyOptional() @IsOptional() @IsString() notes?: string;

	@ApiProperty({ type: [CreateOrderItemDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateOrderItemDto)
	items: CreateOrderItemDto[];
}
