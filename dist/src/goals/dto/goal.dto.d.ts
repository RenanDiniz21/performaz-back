export declare class CreateGoalDto {
    vendorId: string;
    period: "diario" | "semanal" | "mensal";
    type: "receita" | "vendas" | "visitas";
    target: number;
    startDate: string;
    endDate: string;
}
declare const UpdateGoalDto_base: import("@nestjs/common").Type<Partial<CreateGoalDto>>;
export declare class UpdateGoalDto extends UpdateGoalDto_base {
}
export {};
