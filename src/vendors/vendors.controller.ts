import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
	CreateVendorDto,
	UpdateVendorDto,
	UpdateVendorStatusDto,
} from "./dto/vendor.dto";
import { VendorsService } from "./vendors.service";

@ApiTags("vendors")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("vendors")
export class VendorsController {
	constructor(private readonly vendorsService: VendorsService) {}

	@Get()
	@ApiOperation({ summary: "Listar todos os vendedores" })
	findAll() {
		return this.vendorsService.findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "Buscar vendedor por ID" })
	findOne(@Param("id") id: string) {
		return this.vendorsService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "Criar vendedor" })
	create(@Body() dto: CreateVendorDto) {
		return this.vendorsService.create(dto);
	}

	@Put(":id")
	@ApiOperation({ summary: "Atualizar vendedor" })
	update(@Param("id") id: string, @Body() dto: UpdateVendorDto) {
		return this.vendorsService.update(id, dto);
	}

	@Patch(":id/status")
	@ApiOperation({ summary: "Atualizar status do vendedor" })
	updateStatus(@Param("id") id: string, @Body() dto: UpdateVendorStatusDto) {
		return this.vendorsService.updateStatus(id, dto);
	}

	@Delete(":id")
	@HttpCode(204)
	@ApiOperation({ summary: "Remover vendedor" })
	remove(@Param("id") id: string) {
		return this.vendorsService.remove(id);
	}
}
