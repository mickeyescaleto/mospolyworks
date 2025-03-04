import { server } from '@repo/server';

export class NotificationService {
  private static readonly instance = server.notifications;

  public static async getNotifications() {
    const { data, error } = await this.instance.index.get();

    if (error) {
      throw error;
    }

    return data;
  }

  public static async deleteNotification(id: string) {
    const { data, error } = await this.instance({
      notificationId: id,
    }).delete();

    if (error) {
      throw error;
    }

    return data;
  }
}
