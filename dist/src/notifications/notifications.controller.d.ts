import type { JwtPayload } from "../auth/strategies/jwt.strategy";
import type { CreateNotificationDto } from "./dto/notification.dto";
import type { NotificationsService } from "./notifications.service";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(): Promise<{
        totalRecipients: number;
        readCount: number;
        id: string;
        title: string;
        message: string;
        type: "info" | "achievement" | "alert" | "route";
        targetAll: boolean;
        sentAt: Date;
        sentById: string | null;
    }[]>;
    findForVendor(vendorId: string): Promise<{
        readAt: Date | null;
        id: string;
        title: string;
        message: string;
        type: "info" | "achievement" | "alert" | "route";
        targetAll: boolean;
        sentAt: Date;
        sentById: string | null;
    }[]>;
    send(dto: CreateNotificationDto, user: JwtPayload): Promise<{
        totalRecipients: number;
        id: string;
        type: "info" | "achievement" | "alert" | "route";
        title: string;
        message: string;
        targetAll: boolean;
        sentAt: Date;
        sentById: string | null;
    }>;
    markRead(id: string, vendorId: string): Promise<{
        success: boolean;
    }>;
}
