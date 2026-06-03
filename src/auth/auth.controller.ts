import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import {
	ChangeVendorPasswordDto,
	LoginDto,
	RefreshTokenDto,
	VendorLoginDto,
} from "./dto/login.dto";
import type { JwtPayload } from "./strategies/jwt.strategy";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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

	@Post("vendor/change-password")
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: "Alterar senha do vendedor autenticado" })
	changeVendorPassword(
		@Req() req: { user: JwtPayload },
		@Body() dto: ChangeVendorPasswordDto,
	) {
		return this.authService.changeVendorPassword(req.user.sub, dto);
	}
}
