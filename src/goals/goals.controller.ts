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
import type { CreateGoalDto, UpdateGoalDto } from "./dto/goal.dto";
import type { GoalsService } from "./goals.service";

@ApiTags("goals")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("goals")
export class GoalsController {
	constructor(private readonly goalsService: GoalsService) {}

	@Get()
	@ApiOperation({ summary: "Listar metas" })
	@ApiQuery({ name: "vendorId", required: false })
	findAll(@Query("vendorId") vendorId?: string) {
		return this.goalsService.findAll(vendorId);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.goalsService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "Criar meta para vendedor" })
	create(@Body() dto: CreateGoalDto) {
		return this.goalsService.create(dto);
	}

	@Put(":id")
	@ApiOperation({ summary: "Atualizar meta" })
	update(@Param("id") id: string, @Body() dto: UpdateGoalDto) {
		return this.goalsService.update(id, dto);
	}

	@Delete(":id")
	@HttpCode(204)
	remove(@Param("id") id: string) {
		return this.goalsService.remove(id);
	}
}
