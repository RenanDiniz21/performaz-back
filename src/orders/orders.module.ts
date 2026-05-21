import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
	imports: [DbModule, AuthModule],
	controllers: [OrdersController],
	providers: [OrdersService],
	exports: [OrdersService],
})
export class OrdersModule {}
