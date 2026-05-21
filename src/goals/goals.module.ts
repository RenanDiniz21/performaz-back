import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { GoalsController } from "./goals.controller";
import { GoalsService } from "./goals.service";

@Module({
	imports: [DbModule, AuthModule],
	controllers: [GoalsController],
	providers: [GoalsService],
})
export class GoalsModule {}
