import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { QuestsController } from "./quests.controller";
import { QuestsService } from "./quests.service";

@Module({
	imports: [DbModule, AuthModule],
	controllers: [QuestsController],
	providers: [QuestsService],
	exports: [QuestsService],
})
export class QuestsModule {}
