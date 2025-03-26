import { prisma } from '@repo/database';

export abstract class NotificationService {
  static async getNotifications(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        link: true,
        isRead: true,
        createdAt: true,
      },
    });

    return notifications;
  }

  static async deleteNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.delete({
      where: {
        id: notificationId,
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
      },
    });

    return notification;
  }

  static async readNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        user: {
          id: userId,
        },
      },
      data: {
        isRead: true,
      },
    });

    return notification;
  }
}
