import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { RoutesController } from "./routes.controller";
import { RoutesService } from "./routes.service";

@Module({
	imports: [DbModule, AuthModule],
	controllers: [RoutesController],
	providers: [RoutesService],
})
export class RoutesModule {}
