"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const clients_module_1 = require("./clients/clients.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const db_module_1 = require("./db/db.module");
const gamification_module_1 = require("./gamification/gamification.module");
const goals_module_1 = require("./goals/goals.module");
const notifications_module_1 = require("./notifications/notifications.module");
const orders_module_1 = require("./orders/orders.module");
const products_module_1 = require("./products/products.module");
const routes_module_1 = require("./routes/routes.module");
const vendors_module_1 = require("./vendors/vendors.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            db_module_1.DbModule,
            auth_module_1.AuthModule,
            vendors_module_1.VendorsModule,
            clients_module_1.ClientsModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            routes_module_1.RoutesModule,
            goals_module_1.GoalsModule,
            notifications_module_1.NotificationsModule,
            gamification_module_1.GamificationModule,
            dashboard_module_1.DashboardModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map