import { prisma } from '@repo/database';

export class NotificationService {
  static async getNotifications(accountId: string) {
    return await prisma.notification.findMany({
      where: {
        user: {
          id: accountId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async deleteNotification(id: string, accountId: string) {
    return await prisma.notification.delete({
      where: {
        id,
        user: {
          id: accountId,
        },
      },
    });
  }

  static async readNotification(id: string, accountId: string) {
    return await prisma.notification.update({
      where: {
        id,
        user: {
          id: accountId,
        },
      },
      data: {
        isRead: true,
      },
    });
  }
}
