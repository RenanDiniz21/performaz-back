import type { ConfigService } from "@nestjs/config";
import type { JwtService } from "@nestjs/jwt";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
import type { LoginDto, VendorLoginDto } from "./dto/login.dto";
export declare class AuthService {
    private db;
    private jwt;
    private config;
    constructor(db: NodePgDatabase<typeof schema>, jwt: JwtService, config: ConfigService);
    loginManager(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    loginVendor(dto: VendorLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
    private checkLock;
    private incrementAttempts;
    private resetAttempts;
}
