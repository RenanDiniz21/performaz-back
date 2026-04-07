import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiProperty,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { CreateOrderDto } from "./dto/order.dto";
import type { OrdersService } from "./orders.service";

class UpdateOrderStatusDto {
	@ApiProperty({ enum: ["pendente", "confirmado", "cancelado"] })
	@IsEnum(["pendente", "confirmado", "cancelado"])
	status: "pendente" | "confirmado" | "cancelado";
}

@ApiTags("orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Get()
	@ApiOperation({ summary: "Listar pedidos" })
	@ApiQuery({ name: "vendorId", required: false })
	@ApiQuery({ name: "clientId", required: false })
	findAll(
		@Query("vendorId") vendorId?: string,
		@Query("clientId") clientId?: string,
	) {
		return this.ordersService.findAll(vendorId, clientId);
	}

	@Get(":id")
	@ApiOperation({ summary: "Buscar pedido por ID (com itens)" })
	findOne(@Param("id") id: string) {
		return this.ordersService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "Criar pedido" })
	create(@Body() dto: CreateOrderDto) {
		return this.ordersService.create(dto);
	}

	@Patch(":id/status")
	@ApiOperation({ summary: "Atualizar status do pedido" })
	updateStatus(@Param("id") id: string, @Body() dto: UpdateOrderStatusDto) {
		return this.ordersService.updateStatus(id, dto.status);
	}
}
