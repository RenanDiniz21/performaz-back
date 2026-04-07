export declare class RouteClientDto {
    clientId: string;
    order: number;
}
export declare class CreateRouteDto {
    vendorId: string;
    date: string;
    clients: RouteClientDto[];
}
export declare class CheckInDto {
    clientId: string;
    lat?: number;
    lng?: number;
    photoUrl?: string;
    notes?: string;
}
export declare class VisitNoSaleDto {
    clientId: string;
    visitReason: "cliente_fechado" | "sem_interesse" | "vai_comprar_depois";
}
