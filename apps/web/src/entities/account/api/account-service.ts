import { server } from '@repo/server';

export class AccountService {
  static async getAccount() {
    const { data, error } = await server.accounts.users.me.get();

    if (error) {
      throw error;
    }

    return data;
  }

  static async register<
    T extends Parameters<typeof server.accounts.users.auth.register.post>[0],
  >(body: T) {
    const { data, error } =
      await server.accounts.users.auth.register.post(body);

    if (error) {
      throw error;
    }

    return data;
  }

  static async login<
    T extends Parameters<typeof server.accounts.users.auth.login.post>[0],
  >(body: T) {
    const { data, error } = await server.accounts.users.auth.login.post(body);

    if (error) {
      throw error;
    }

    return data;
  }

  static async logout() {
    const { data, error } = await server.accounts.users.auth.logout.post();

    if (error) {
      throw error;
    }

    return data;
  }
}
