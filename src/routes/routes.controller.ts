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
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
	CheckInDto,
	CreateRouteDto,
	VisitNoSaleDto,
} from "./dto/route.dto";
import { RoutesService } from "./routes.service";

@ApiTags("routes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("routes")
export class RoutesController {
	constructor(private readonly routesService: RoutesService) {}

	@Get()
	@ApiOperation({ summary: "Listar rotas" })
	@ApiQuery({ name: "vendorId", required: false })
	@ApiQuery({ name: "date", required: false, description: "YYYY-MM-DD" })
	findAll(@Query("vendorId") vendorId?: string, @Query("date") date?: string) {
		return this.routesService.findAll(vendorId, date);
	}

	@Get(":id")
	@ApiOperation({ summary: "Buscar rota por ID (com clientes)" })
	findOne(@Param("id") id: string) {
		return this.routesService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "Criar rota" })
	create(@Body() dto: CreateRouteDto) {
		return this.routesService.create(dto);
	}

	@Post(":id/checkin")
	@ApiOperation({ summary: "Fazer check-in em um cliente da rota (ganha XP)" })
	checkIn(@Param("id") id: string, @Body() dto: CheckInDto) {
		return this.routesService.checkIn(id, dto);
	}

	@Post(":id/no-sale")
	@ApiOperation({ summary: "Registrar visita sem venda" })
	noSale(@Param("id") id: string, @Body() dto: VisitNoSaleDto) {
		return this.routesService.registerNoSale(id, dto);
	}

	@Patch(":id/reorder")
	@ApiOperation({ summary: "Reordenar clientes da rota" })
	reorder(
		@Param("id") id: string,
		@Body() clients: { clientId: string; order: number }[],
	) {
		return this.routesService.updateClientOrder(id, clients);
	}
}
