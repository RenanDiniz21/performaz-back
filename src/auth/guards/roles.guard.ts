import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { JwtPayload } from "../strategies/jwt.strategy";

export const ROLES_KEY = "roles";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) { }

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (!requiredRoles) return true;

		const { user } = context.switchToHttp().getRequest<{ user: JwtPayload }>();
		return requiredRoles.includes(user.role);
	}
}
