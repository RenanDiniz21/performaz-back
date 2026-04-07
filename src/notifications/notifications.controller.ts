import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { JwtPayload } from "../auth/strategies/jwt.strategy";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { CreateNotificationDto } from "./dto/notification.dto";
import type { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Get()
	@ApiOperation({ summary: "Listar todas as notificações (gestor)" })
	findAll() {
		return this.notificationsService.findAll();
	}

	@Get("vendor/:vendorId")
	@ApiOperation({ summary: "Listar notificações de um vendedor específico" })
	findForVendor(@Param("vendorId") vendorId: string) {
		return this.notificationsService.findForVendor(vendorId);
	}

	@Post()
	@ApiOperation({ summary: "Enviar notificação (broadcast ou específica)" })
	send(@Body() dto: CreateNotificationDto, @CurrentUser() user: JwtPayload) {
		return this.notificationsService.send(dto, user.sub);
	}

	@Patch(":id/read/:vendorId")
	@ApiOperation({ summary: "Marcar notificação como lida" })
	markRead(@Param("id") id: string, @Param("vendorId") vendorId: string) {
		return this.notificationsService.markRead(id, vendorId);
	}
}
