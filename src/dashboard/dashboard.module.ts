import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
	imports: [DbModule, AuthModule],
	controllers: [DashboardController],
	providers: [DashboardService],
})
export class DashboardModule {}
