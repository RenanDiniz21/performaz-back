export declare class CreateProductDto {
    code: string;
    name: string;
    category: string;
    unit: string;
    price: number;
    stock: number;
    active?: boolean;
    imageUrl?: string;
}
declare const UpdateProductDto_base: import("@nestjs/common").Type<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
}
export {};
