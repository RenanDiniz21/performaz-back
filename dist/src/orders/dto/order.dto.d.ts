export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateOrderDto {
    vendorId: string;
    clientId: string;
    notes?: string;
    items: CreateOrderItemDto[];
}
