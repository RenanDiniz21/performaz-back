import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DbModule } from "../db/db.module";
import { VendorsController } from "./vendors.controller";
import { VendorsService } from "./vendors.service";

@Module({
	imports: [DbModule, AuthModule],
	controllers: [VendorsController],
	providers: [VendorsService],
	exports: [VendorsService],
})
export class VendorsModule {}
