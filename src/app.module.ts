import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ClientsModule } from "./clients/clients.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DbModule } from "./db/db.module";
import { GamificationModule } from "./gamification/gamification.module";
import { GoalsModule } from "./goals/goals.module";
import { HealthController } from "./health.controller";
import { NotificationsModule } from "./notifications/notifications.module";
import { OrdersModule } from "./orders/orders.module";
import { ProductsModule } from "./products/products.module";
import { QuestsModule } from "./quests/quests.module";
import { RoutesModule } from "./routes/routes.module";
import { VendorsModule } from "./vendors/vendors.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DbModule,
		AuthModule,
		VendorsModule,
		ClientsModule,
		ProductsModule,
		QuestsModule,
		OrdersModule,
		RoutesModule,
		GoalsModule,
		NotificationsModule,
		GamificationModule,
		DashboardModule,
	],
	controllers: [HealthController],
})
export class AppModule {}
