"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const db_module_1 = require("../db/db.module");
const schema = __importStar(require("../db/schema"));
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
let AuthService = class AuthService {
    db;
    jwt;
    config;
    constructor(db, jwt, config) {
        this.db = db;
        this.jwt = jwt;
        this.config = config;
    }
    async loginManager(dto) {
        const [user] = await this.db
            .select()
            .from(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.email, dto.email));
        if (!user)
            throw new common_1.UnauthorizedException("Credenciais inválidas");
        await this.checkLock(user.lockedUntil, user.loginAttempts, schema.users, user.id);
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            await this.incrementAttempts(schema.users, user.id, user.loginAttempts);
            throw new common_1.UnauthorizedException("Credenciais inválidas");
        }
        await this.resetAttempts(schema.users, user.id);
        return this.generateTokens({
            sub: user.id,
            email: user.email,
            role: "GESTOR",
        });
    }
    async loginVendor(dto) {
        const [vendor] = await this.db
            .select()
            .from(schema.vendors)
            .where((0, drizzle_orm_1.eq)(schema.vendors.matricula, dto.matricula));
        if (!vendor)
            throw new common_1.UnauthorizedException("Credenciais inválidas");
        await this.checkLock(vendor.lockedUntil, vendor.loginAttempts, schema.vendors, vendor.id);
        const valid = await bcrypt.compare(dto.password, vendor.passwordHash);
        if (!valid) {
            await this.incrementAttempts(schema.vendors, vendor.id, vendor.loginAttempts);
            throw new common_1.UnauthorizedException("Credenciais inválidas");
        }
        await this.db
            .update(schema.vendors)
            .set({ lastActive: new Date(), loginAttempts: 0, lockedUntil: null })
            .where((0, drizzle_orm_1.eq)(schema.vendors.id, vendor.id));
        return this.generateTokens({
            sub: vendor.id,
            email: vendor.email,
            role: "VENDEDOR",
        });
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwt.verify(refreshToken, {
                secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
            });
            return this.generateTokens({
                sub: payload.sub,
                email: payload.email,
                role: payload.role,
            });
        }
        catch {
            throw new common_1.UnauthorizedException("Refresh token inválido");
        }
    }
    async generateTokens(payload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: this.config.getOrThrow("JWT_SECRET"),
                expiresIn: this.config.getOrThrow("JWT_EXPIRES_IN"),
            }),
            this.jwt.signAsync(payload, {
                secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
                expiresIn: this.config.getOrThrow("JWT_REFRESH_EXPIRES_IN"),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async checkLock(lockedUntil, attempts, table, id) {
        if (lockedUntil && lockedUntil > new Date()) {
            throw new common_1.UnauthorizedException(`Conta bloqueada. Tente novamente após ${lockedUntil.toISOString()}`);
        }
    }
    async incrementAttempts(table, id, current) {
        const attempts = current + 1;
        const lock = attempts >= MAX_ATTEMPTS
            ? new Date(Date.now() + LOCK_MINUTES * 60_000)
            : null;
        await this.db
            .update(table)
            .set({ loginAttempts: attempts, lockedUntil: lock })
            .where((0, drizzle_orm_1.eq)(table.id, id));
    }
    async resetAttempts(table, id) {
        await this.db
            .update(table)
            .set({ loginAttempts: 0, lockedUntil: null })
            .where((0, drizzle_orm_1.eq)(table.id, id));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Function, Function, Function])
], AuthService);
//# sourceMappingURL=auth.service.js.map