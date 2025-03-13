import { prisma } from '@repo/database';

export abstract class NotificationService {
  static async getNotifications(userId: string) {
    return await prisma.notification.findMany({ where: { userId } });
  }

  static async deleteNotificationById(id: string) {
    return await prisma.notification.delete({ where: { id } });
  }
}
