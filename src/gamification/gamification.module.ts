import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { GamificationController } from "./gamification.controller";
import { GamificationService } from "./gamification.service";

@Module({
	imports: [DbModule, AuthModule],
	controllers: [GamificationController],
	providers: [GamificationService],
})
export class GamificationModule {}
