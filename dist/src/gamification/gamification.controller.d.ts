import type { GamificationService } from "./gamification.service";
declare class UpdateLocationDto {
    lat: number;
    lng: number;
}
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    leaderboard(metric?: "xp" | "revenue", period?: "diario" | "semanal" | "mensal"): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        region: string;
        xp: number;
        level: number;
        totalRevenue: number;
        totalSales: number;
    }[]>;
    achievements(): Promise<{
        id: string;
        name: string;
        description: string;
        icon: string;
        xpReward: number;
        condition: string;
    }[]>;
    stats(vendorId: string): Promise<{
        vendor: {
            id: string;
            name: string;
            email: string;
            matricula: string;
            passwordHash: string;
            phone: string;
            avatar: string | null;
            status: "ativo" | "inativo" | "ferias";
            region: string;
            xp: number;
            level: number;
            totalSales: number;
            totalRevenue: number;
            goalsHit: number;
            goalsTotal: number;
            refreshToken: string | null;
            loginAttempts: number;
            lockedUntil: Date | null;
            joinedAt: Date;
            lastActive: Date;
            updatedAt: Date;
        };
        achievements: {
            unlockedAt: Date;
            id: string;
            name: string;
            description: string;
            icon: string;
            xpReward: number;
            condition: string;
        }[];
        xpHistory: {
            id: string;
            type: "checkin" | "venda" | "meta_atingida" | "conquista";
            description: string;
            xpEarned: number;
            vendorId: string;
            createdAt: Date;
        }[];
    }>;
    map(): Promise<{
        vendorId: string;
        lat: number;
        lng: number;
        updatedAt: Date;
        name: string;
        avatar: string | null;
        status: "ativo" | "inativo" | "ferias";
    }[]>;
    updateLocation(vendorId: string, dto: UpdateLocationDto): Promise<{
        success: boolean;
    }>;
}
export {};
