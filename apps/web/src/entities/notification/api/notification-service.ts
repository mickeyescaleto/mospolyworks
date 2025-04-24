import { server } from '@repo/server';

export class NotificationService {
  static async getNotifications() {
    const { data, error } = await server.notifications.index.get();

    if (error) {
      throw error;
    }

    return data;
  }

  static async readNotificationById(id: string) {
    const { data, error } = await server.notifications({ id }).read.post();

    if (error) {
      throw error;
    }

    return data;
  }

  static async deleteNotificationById(id: string) {
    const { data, error } = await server.notifications({ id }).delete();

    if (error) {
      throw error;
    }

    return data;
  }
}
