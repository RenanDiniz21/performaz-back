import {
	Body,
	Controller,
	Get,
	Param,
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
import { IsNumber } from "class-validator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GamificationService } from "./gamification.service";

class UpdateLocationDto {
	@ApiProperty() @IsNumber() lat: number;
	@ApiProperty() @IsNumber() lng: number;
}

@ApiTags("gamification")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("gamification")
export class GamificationController {
	constructor(private readonly gamificationService: GamificationService) {}

	@Get("leaderboard")
	@ApiOperation({ summary: "Ranking de vendedores" })
	@ApiQuery({ name: "metric", required: false, enum: ["xp", "revenue"] })
	@ApiQuery({
		name: "period",
		required: false,
		enum: ["diario", "semanal", "mensal"],
	})
	leaderboard(
		@Query("metric") metric: "xp" | "revenue" = "xp",
		@Query("period") period: "diario" | "semanal" | "mensal" = "mensal",
	) {
		return this.gamificationService.getLeaderboard(metric, period);
	}

	@Get("achievements")
	@ApiOperation({ summary: "Listar todas as conquistas disponíveis" })
	achievements() {
		return this.gamificationService.getAllAchievements();
	}

	@Get("vendors/:vendorId/stats")
	@ApiOperation({ summary: "Estatísticas de gamificação de um vendedor" })
	stats(@Param("vendorId") vendorId: string) {
		return this.gamificationService.getVendorStats(vendorId);
	}

	@Get("map")
	@ApiOperation({
		summary: "Localização em tempo real de todos os vendedores (mapa)",
	})
	map() {
		return this.gamificationService.getAllVendorLocations();
	}

	@Post("vendors/:vendorId/location")
	@ApiOperation({ summary: "Atualizar localização do vendedor" })
	updateLocation(
		@Param("vendorId") vendorId: string,
		@Body() dto: UpdateLocationDto,
	) {
		return this.gamificationService.updateVendorLocation(
			vendorId,
			dto.lat,
			dto.lng,
		);
	}
}
