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
import type { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import type { ProductsService } from "./products.service";

@ApiTags("products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	@ApiOperation({ summary: "Listar produtos (com busca por nome ou código)" })
	@ApiQuery({ name: "search", required: false })
	findAll(@Query("search") search?: string) {
		return this.productsService.findAll(search);
	}

	@Get(":id")
	@ApiOperation({ summary: "Buscar produto por ID" })
	findOne(@Param("id") id: string) {
		return this.productsService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "Criar produto" })
	create(@Body() dto: CreateProductDto) {
		return this.productsService.create(dto);
	}

	@Put(":id")
	@ApiOperation({ summary: "Atualizar produto" })
	update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
		return this.productsService.update(id, dto);
	}

	@Delete(":id")
	@HttpCode(204)
	@ApiOperation({ summary: "Remover produto" })
	remove(@Param("id") id: string) {
		return this.productsService.remove(id);
	}
}
