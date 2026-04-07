import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
import type { CreateOrderDto } from "./dto/order.dto";
export declare class OrdersService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    findAll(vendorId?: string, clientId?: string): Promise<{
        id: string;
        total: number;
        status: "pendente" | "confirmado" | "cancelado";
        notes: string | null;
        vendorId: string;
        clientId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        items: {
            id: string;
            quantity: number;
            unitPrice: number;
            subtotal: number;
            orderId: string;
            productId: string;
        }[];
        id: string;
        total: number;
        status: "pendente" | "confirmado" | "cancelado";
        notes: string | null;
        vendorId: string;
        clientId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateOrderDto): Promise<{
        items: {
            id: string;
            quantity: number;
            unitPrice: number;
            subtotal: number;
            orderId: string;
            productId: string;
        }[];
        id: string;
        status: "pendente" | "confirmado" | "cancelado";
        updatedAt: Date;
        notes: string | null;
        vendorId: string;
        createdAt: Date;
        clientId: string;
        total: number;
    }>;
    updateStatus(id: string, status: "pendente" | "confirmado" | "cancelado"): Promise<{
        id: string;
        total: number;
        status: "pendente" | "confirmado" | "cancelado";
        notes: string | null;
        vendorId: string;
        clientId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
