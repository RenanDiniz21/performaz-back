import type { CheckInDto, CreateRouteDto, VisitNoSaleDto } from "./dto/route.dto";
import type { RoutesService } from "./routes.service";
export declare class RoutesController {
    private readonly routesService;
    constructor(routesService: RoutesService);
    findAll(vendorId?: string, date?: string): Promise<{
        id: string;
        date: Date;
        status: "nao_iniciada" | "em_andamento" | "concluida";
        totalClients: number;
        visitedClients: number;
        salesMade: number;
        vendorId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        clients: {
            id: string;
            order: number;
            status: "pendente" | "visitado" | "venda_realizada" | "sem_venda";
            checkInTime: Date | null;
            visitReason: "cliente_fechado" | "sem_interesse" | "vai_comprar_depois" | null;
            routeId: string;
            clientId: string;
        }[];
        id: string;
        date: Date;
        status: "nao_iniciada" | "em_andamento" | "concluida";
        totalClients: number;
        visitedClients: number;
        salesMade: number;
        vendorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateRouteDto): Promise<{
        clients: {
            id: string;
            status: "pendente" | "visitado" | "venda_realizada" | "sem_venda";
            clientId: string;
            order: number;
            checkInTime: Date | null;
            visitReason: "cliente_fechado" | "sem_interesse" | "vai_comprar_depois" | null;
            routeId: string;
        }[];
        date: Date;
        id: string;
        status: "nao_iniciada" | "em_andamento" | "concluida";
        updatedAt: Date;
        vendorId: string;
        createdAt: Date;
        totalClients: number;
        visitedClients: number;
        salesMade: number;
    }>;
    checkIn(id: string, dto: CheckInDto): Promise<{
        success: boolean;
        xpEarned: number;
    }>;
    noSale(id: string, dto: VisitNoSaleDto): Promise<{
        success: boolean;
    }>;
    reorder(id: string, clients: {
        clientId: string;
        order: number;
    }[]): Promise<{
        clients: {
            id: string;
            order: number;
            status: "pendente" | "visitado" | "venda_realizada" | "sem_venda";
            checkInTime: Date | null;
            visitReason: "cliente_fechado" | "sem_interesse" | "vai_comprar_depois" | null;
            routeId: string;
            clientId: string;
        }[];
        id: string;
        date: Date;
        status: "nao_iniciada" | "em_andamento" | "concluida";
        totalClients: number;
        visitedClients: number;
        salesMade: number;
        vendorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
