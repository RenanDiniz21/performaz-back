import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { DbModule } from "../db/db.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
	imports: [DbModule, PassportModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
	exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
