import { server } from '@repo/server';

export class UserService {
  static async getUsersForProject() {
    const { data, error } = await server.users['for-project'].get();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getUserById(id: string) {
    const { data, error } = await server.users({ id }).get();

    if (error) {
      throw error;
    }

    return data;
  }
}
