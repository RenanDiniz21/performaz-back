import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
export declare class GamificationService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    getLeaderboard(metric?: "xp" | "revenue", period?: "diario" | "semanal" | "mensal"): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        region: string;
        xp: number;
        level: number;
        totalRevenue: number;
        totalSales: number;
    }[]>;
    getVendorStats(vendorId: string): Promise<{
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
    getAllAchievements(): Promise<{
        id: string;
        name: string;
        description: string;
        icon: string;
        xpReward: number;
        condition: string;
    }[]>;
    updateVendorLocation(vendorId: string, lat: number, lng: number): Promise<{
        success: boolean;
    }>;
    getAllVendorLocations(): Promise<{
        vendorId: string;
        lat: number;
        lng: number;
        updatedAt: Date;
        name: string;
        avatar: string | null;
        status: "ativo" | "inativo" | "ferias";
    }[]>;
}
