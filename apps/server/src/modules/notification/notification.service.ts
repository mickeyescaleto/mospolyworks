import { prisma } from '@repo/database';

import { type ICreateNotificationBody } from '@/modules/notification/schemas/routes/create-notification';

export class NotificationService {
  static async createNotification(
    userId: string,
    body: ICreateNotificationBody,
  ) {
    return await prisma.notification.create({
      data: {
        ...body,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

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
