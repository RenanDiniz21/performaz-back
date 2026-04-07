import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { ClientsService } from "./clients.service";
import type { CreateClientDto, UpdateClientDto } from "./dto/client.dto";

@ApiTags("clients")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("clients")
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Get()
	@ApiOperation({ summary: "Listar clientes (com busca por nome ou CNPJ)" })
	@ApiQuery({ name: "search", required: false })
	findAll(@Query("search") search?: string) {
		return this.clientsService.findAll(search);
	}

	@Get(":id")
	@ApiOperation({ summary: "Buscar cliente por ID" })
	findOne(@Param("id") id: string) {
		return this.clientsService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "Criar cliente" })
	create(@Body() dto: CreateClientDto) {
		return this.clientsService.create(dto);
	}

	@Put(":id")
	@ApiOperation({ summary: "Atualizar cliente" })
	update(@Param("id") id: string, @Body() dto: UpdateClientDto) {
		return this.clientsService.update(id, dto);
	}

	@Delete(":id")
	@HttpCode(204)
	@ApiOperation({ summary: "Remover cliente" })
	remove(@Param("id") id: string) {
		return this.clientsService.remove(id);
	}
}
