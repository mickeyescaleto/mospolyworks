import { server } from '@repo/server';
import { UserLoginCredentials } from '@/types/user';

export class AuthService {
  private static readonly instance = server.authentication;

  public static async getProfile() {
    const { data, error } = await this.instance.profile.get();

    if (error) {
      throw error;
    }

    return data;
  }

  public static async login(credentials: UserLoginCredentials) {
    const { data, error } = await this.instance.login.post(credentials);

    if (error) {
      throw error;
    }

    return data;
  }

  public static async logout() {
    const { data, error } = await this.instance.logout.get();

    if (error) {
      throw error;
    }

    return data;
  }
}
