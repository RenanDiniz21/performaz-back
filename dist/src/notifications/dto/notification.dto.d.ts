export declare class CreateNotificationDto {
    title: string;
    message: string;
    type: "info" | "achievement" | "alert" | "route";
    targetAll: boolean;
    targetVendorIds?: string[];
}
