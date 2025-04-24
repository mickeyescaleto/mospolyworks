import { server } from '@repo/server';

export class TagService {
  static async getTagsForProject(categoryId: string) {
    const { data, error } = await server.tags['for-project'].get({
      query: {
        categoryId,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  static async getTagById(id: string) {
    const { data, error } = await server.tags
      .exhibitions({ id })
      .get({ fetch: { next: { revalidate: 1800, tags: [`tag-${id}`] } } });

    if (error) {
      throw error;
    }

    return data;
  }

  static async getTags(id: string) {
    const { data, error } = await server.tags({ id }).get();

    if (error) {
      throw error;
    }

    return data;
  }

  static async createTag<
    T extends Parameters<typeof server.tags.index.post>[0],
  >(body: T) {
    const { data, error } = await server.tags.index.post(body);

    if (error) {
      throw error;
    }

    return data;
  }

  static async deleteTag(id: string) {
    const { data, error } = await server.tags({ id }).delete();

    if (error) {
      throw error;
    }

    return data;
  }
}
