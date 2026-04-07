import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";
import type { CreateNotificationDto } from "./dto/notification.dto";

@Injectable()
export class NotificationsService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async findAll() {
		const notifs = await this.db.select().from(schema.notifications);
		const withCounts = await Promise.all(
			notifs.map(async (n) => {
				const recipients = await this.db
					.select()
					.from(schema.notificationRecipients)
					.where(eq(schema.notificationRecipients.notificationId, n.id));
				return {
					...n,
					totalRecipients: recipients.length,
					readCount: recipients.filter((r) => r.readAt !== null).length,
				};
			}),
		);
		return withCounts;
	}

	async send(dto: CreateNotificationDto, sentById?: string) {
		const [notif] = await this.db
			.insert(schema.notifications)
			.values({
				title: dto.title,
				message: dto.message,
				type: dto.type,
				targetAll: dto.targetAll,
				sentById,
			})
			.returning();

		let vendorIds = dto.targetVendorIds ?? [];

		if (dto.targetAll) {
			const vendors = await this.db
				.select({ id: schema.vendors.id })
				.from(schema.vendors);
			vendorIds = vendors.map((v) => v.id);
		}

		if (vendorIds.length) {
			await this.db
				.insert(schema.notificationRecipients)
				.values(
					vendorIds.map((vendorId) => ({ notificationId: notif.id, vendorId })),
				);
		}

		return { ...notif, totalRecipients: vendorIds.length };
	}

	async markRead(notificationId: string, vendorId: string) {
		const [recipient] = await this.db
			.select()
			.from(schema.notificationRecipients)
			.where(eq(schema.notificationRecipients.notificationId, notificationId));
		if (!recipient)
			throw new NotFoundException(
				"Notificação não encontrada para este vendedor",
			);

		await this.db
			.update(schema.notificationRecipients)
			.set({ readAt: new Date() })
			.where(eq(schema.notificationRecipients.id, recipient.id));

		return { success: true };
	}

	async findForVendor(vendorId: string) {
		const recipients = await this.db
			.select()
			.from(schema.notificationRecipients)
			.where(eq(schema.notificationRecipients.vendorId, vendorId));

		const notifs = await Promise.all(
			recipients.map(async ({ notificationId, readAt }) => {
				const [notif] = await this.db
					.select()
					.from(schema.notifications)
					.where(eq(schema.notifications.id, notificationId));
				return { ...notif, readAt };
			}),
		);

		return notifs;
	}
}
