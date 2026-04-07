import type { CreateOrderDto } from "./dto/order.dto";
import type { OrdersService } from "./orders.service";
declare class UpdateOrderStatusDto {
    status: "pendente" | "confirmado" | "cancelado";
}
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
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
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
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
export {};
