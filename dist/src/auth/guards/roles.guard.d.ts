import { type CanActivate, type ExecutionContext } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
export declare const ROLES_KEY = "roles";
export declare class RolesGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
