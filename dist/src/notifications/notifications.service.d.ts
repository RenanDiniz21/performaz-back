import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
import type { CreateNotificationDto } from "./dto/notification.dto";
export declare class NotificationsService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
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
    send(dto: CreateNotificationDto, sentById?: string): Promise<{
        totalRecipients: number;
        id: string;
        type: "info" | "achievement" | "alert" | "route";
        title: string;
        message: string;
        targetAll: boolean;
        sentAt: Date;
        sentById: string | null;
    }>;
    markRead(notificationId: string, vendorId: string): Promise<{
        success: boolean;
    }>;
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
}
