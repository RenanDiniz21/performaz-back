export declare class CreateClientDto {
    name: string;
    cnpj: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    segment: string;
    notes?: string;
    vendorId?: string;
}
declare const UpdateClientDto_base: import("@nestjs/common").Type<Partial<CreateClientDto>>;
export declare class UpdateClientDto extends UpdateClientDto_base {
}
export {};
