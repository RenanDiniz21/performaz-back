import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
	LoginDto,
	RefreshTokenDto,
	VendorLoginDto,
} from "./dto/login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post("login")
	@ApiOperation({ summary: "Login do gestor (painel web)" })
	loginManager(@Body() dto: LoginDto) {
		return this.authService.loginManager(dto);
	}

	@Post("vendor/login")
	@ApiOperation({ summary: "Login do vendedor (app mobile)" })
	loginVendor(@Body() dto: VendorLoginDto) {
		return this.authService.loginVendor(dto);
	}

	@Post("refresh")
	@ApiOperation({ summary: "Renovar access token" })
	refresh(@Body() dto: RefreshTokenDto) {
		return this.authService.refresh(dto.refreshToken);
	}
}
