import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { DashboardService } from "./dashboard.service";

@ApiTags("dashboard")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("dashboard")
export class DashboardController {
	constructor(private readonly dashboardService: DashboardService) {}

	@Get("kpis")
	@ApiOperation({ summary: "KPIs principais do painel do gestor" })
	kpis() {
		return this.dashboardService.getKPIs();
	}

	@Get("revenue")
	@ApiOperation({ summary: "Receita diária dos últimos N dias" })
	@ApiQuery({ name: "days", required: false, type: Number })
	revenue(@Query("days") days?: string) {
		return this.dashboardService.getDailyRevenue(days ? Number(days) : 10);
	}
}
