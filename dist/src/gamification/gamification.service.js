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
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const db_module_1 = require("../db/db.module");
const schema = __importStar(require("../db/schema"));
let GamificationService = class GamificationService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getLeaderboard(metric = "xp", period = "mensal") {
        const vendors = await this.db
            .select({
            id: schema.vendors.id,
            name: schema.vendors.name,
            avatar: schema.vendors.avatar,
            region: schema.vendors.region,
            xp: schema.vendors.xp,
            level: schema.vendors.level,
            totalRevenue: schema.vendors.totalRevenue,
            totalSales: schema.vendors.totalSales,
        })
            .from(schema.vendors)
            .where((0, drizzle_orm_1.eq)(schema.vendors.status, "ativo"));
        return vendors.sort((a, b) => metric === "xp" ? b.xp - a.xp : b.totalRevenue - a.totalRevenue);
    }
    async getVendorStats(vendorId) {
        const [vendor] = await this.db
            .select()
            .from(schema.vendors)
            .where((0, drizzle_orm_1.eq)(schema.vendors.id, vendorId));
        const achievements = await this.db
            .select({
            achievement: schema.achievements,
            unlockedAt: schema.vendorAchievements.unlockedAt,
        })
            .from(schema.vendorAchievements)
            .innerJoin(schema.achievements, (0, drizzle_orm_1.eq)(schema.vendorAchievements.achievementId, schema.achievements.id))
            .where((0, drizzle_orm_1.eq)(schema.vendorAchievements.vendorId, vendorId));
        const xpHistory = await this.db
            .select()
            .from(schema.xpActivities)
            .where((0, drizzle_orm_1.eq)(schema.xpActivities.vendorId, vendorId))
            .orderBy((0, drizzle_orm_1.desc)(schema.xpActivities.createdAt))
            .limit(50);
        return {
            vendor,
            achievements: achievements.map((a) => ({
                ...a.achievement,
                unlockedAt: a.unlockedAt,
            })),
            xpHistory,
        };
    }
    async getAllAchievements() {
        return this.db.select().from(schema.achievements);
    }
    async updateVendorLocation(vendorId, lat, lng) {
        const existing = await this.db
            .select()
            .from(schema.vendorLocations)
            .where((0, drizzle_orm_1.eq)(schema.vendorLocations.vendorId, vendorId));
        if (existing.length) {
            await this.db
                .update(schema.vendorLocations)
                .set({ lat, lng, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema.vendorLocations.vendorId, vendorId));
        }
        else {
            await this.db
                .insert(schema.vendorLocations)
                .values({ vendorId, lat, lng });
        }
        return { success: true };
    }
    async getAllVendorLocations() {
        return this.db
            .select({
            vendorId: schema.vendorLocations.vendorId,
            lat: schema.vendorLocations.lat,
            lng: schema.vendorLocations.lng,
            updatedAt: schema.vendorLocations.updatedAt,
            name: schema.vendors.name,
            avatar: schema.vendors.avatar,
            status: schema.vendors.status,
        })
            .from(schema.vendorLocations)
            .innerJoin(schema.vendors, (0, drizzle_orm_1.eq)(schema.vendorLocations.vendorId, schema.vendors.id));
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Function])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map