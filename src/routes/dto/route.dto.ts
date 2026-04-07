import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from "class-validator";

export class RouteClientDto {
	@ApiProperty() @IsString() @IsNotEmpty() clientId: string;
	@ApiProperty() @IsInt() @Min(1) order: number;
}

export class CreateRouteDto {
	@ApiProperty() @IsString() @IsNotEmpty() vendorId: string;
	@ApiProperty() @IsDateString() date: string;

	@ApiProperty({ type: [RouteClientDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => RouteClientDto)
	clients: RouteClientDto[];
}

export class CheckInDto {
	@ApiProperty() @IsString() @IsNotEmpty() clientId: string;
	@ApiPropertyOptional() @IsOptional() lat?: number;
	@ApiPropertyOptional() @IsOptional() lng?: number;
	@ApiPropertyOptional() @IsOptional() @IsString() photoUrl?: string;
	@ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class VisitNoSaleDto {
	@ApiProperty() @IsString() @IsNotEmpty() clientId: string;
	@ApiProperty({
		enum: ["cliente_fechado", "sem_interesse", "vai_comprar_depois"],
	})
	visitReason: "cliente_fechado" | "sem_interesse" | "vai_comprar_depois";
}
