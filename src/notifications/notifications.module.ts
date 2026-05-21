import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

@Module({
	imports: [DbModule, AuthModule],
	controllers: [NotificationsController],
	providers: [NotificationsService],
})
export class NotificationsModule {}
