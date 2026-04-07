import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
import type { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
export declare class ProductsService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    findAll(search?: string): Promise<{
        id: string;
        code: string;
        name: string;
        category: string;
        unit: string;
        price: number;
        stock: number;
        active: boolean;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        code: string;
        name: string;
        category: string;
        unit: string;
        price: number;
        stock: number;
        active: boolean;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateProductDto): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        createdAt: Date;
        code: string;
        category: string;
        unit: string;
        price: number;
        stock: number;
        active: boolean;
        imageUrl: string | null;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        id: string;
        code: string;
        name: string;
        category: string;
        unit: string;
        price: number;
        stock: number;
        active: boolean;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
