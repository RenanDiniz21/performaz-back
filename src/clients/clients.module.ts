import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { ClientsController } from "./clients.controller";
import { ClientsService } from "./clients.service";

@Module({
	imports: [DbModule, AuthModule],
	controllers: [ClientsController],
	providers: [ClientsService],
	exports: [ClientsService],
})
export class ClientsModule {}
