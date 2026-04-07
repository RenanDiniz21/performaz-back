import type { AuthService } from "./auth.service";
import type { LoginDto, RefreshTokenDto, VendorLoginDto } from "./dto/login.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginManager(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    loginVendor(dto: VendorLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
