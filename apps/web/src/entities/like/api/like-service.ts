import { server } from '@repo/server';

export class LikeService {
  static async createLike(projectId: string) {
    const { data, error } = await server.likes.index.post({ projectId });

    if (error) {
      throw error;
    }

    return data;
  }

  static async deleteLike(id: string) {
    const { data, error } = await server.likes({ id }).delete();

    if (error) {
      throw error;
    }

    return data;
  }
}
