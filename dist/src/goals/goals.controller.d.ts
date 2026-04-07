import type { CreateGoalDto, UpdateGoalDto } from "./dto/goal.dto";
import type { GoalsService } from "./goals.service";
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    findAll(vendorId?: string): Promise<{
        id: string;
        period: "diario" | "semanal" | "mensal";
        type: "receita" | "vendas" | "visitas";
        target: number;
        current: number;
        startDate: Date;
        endDate: Date;
        vendorId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        period: "diario" | "semanal" | "mensal";
        type: "receita" | "vendas" | "visitas";
        target: number;
        current: number;
        startDate: Date;
        endDate: Date;
        vendorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateGoalDto): Promise<{
        id: string;
        updatedAt: Date;
        vendorId: string;
        createdAt: Date;
        type: "receita" | "vendas" | "visitas";
        period: "diario" | "semanal" | "mensal";
        target: number;
        current: number;
        startDate: Date;
        endDate: Date;
    }>;
    update(id: string, dto: UpdateGoalDto): Promise<{
        id: string;
        period: "diario" | "semanal" | "mensal";
        type: "receita" | "vendas" | "visitas";
        target: number;
        current: number;
        startDate: Date;
        endDate: Date;
        vendorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
