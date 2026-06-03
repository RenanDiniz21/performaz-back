import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
	CreateQuestDto,
	UpdateQuestDto,
	UpdateQuestProgressDto,
} from "./dto/quest.dto";
import { QuestsService } from "./quests.service";

@ApiTags("quests")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("quests")
export class QuestsController {
	constructor(private readonly questsService: QuestsService) {}

	@Get()
	@ApiOperation({ summary: "Listar missoes" })
	findAll() {
		return this.questsService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.questsService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "Criar missao" })
	create(@Body() dto: CreateQuestDto) {
		return this.questsService.create(dto);
	}

	@Put(":id")
	@ApiOperation({ summary: "Atualizar missao" })
	update(@Param("id") id: string, @Body() dto: UpdateQuestDto) {
		return this.questsService.update(id, dto);
	}

	@Put(":id/progress")
	@ApiOperation({ summary: "Atualizar progresso da missao" })
	updateProgress(
		@Param("id") id: string,
		@Body() dto: UpdateQuestProgressDto,
	) {
		return this.questsService.updateProgress(id, dto);
	}

	@Delete(":id")
	@HttpCode(204)
	remove(@Param("id") id: string) {
		return this.questsService.remove(id);
	}
}
