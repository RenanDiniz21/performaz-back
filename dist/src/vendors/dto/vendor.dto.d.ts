export declare class CreateVendorDto {
    name: string;
    email: string;
    matricula: string;
    password: string;
    phone: string;
    region: string;
    avatar?: string;
}
declare const UpdateVendorDto_base: import("@nestjs/common").Type<Partial<CreateVendorDto>>;
export declare class UpdateVendorDto extends UpdateVendorDto_base {
}
export declare class UpdateVendorStatusDto {
    status: "ativo" | "inativo" | "ferias";
}
export {};
