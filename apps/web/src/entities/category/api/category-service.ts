import { server } from '@repo/server';

export class CategoryService {
  static async getCategoriesForProject() {
    const { data, error } = await server.categories['for-project'].get();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getExhibitionCategories() {
    const { data, error } = await server.categories.exhibitions.get({
      query: {},
      fetch: { next: { revalidate: 1800, tags: ['categories'] } },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  static async getCategoryById(id: string) {
    const { data, error } = await server.categories.exhibitions({ id }).get({
      fetch: { next: { revalidate: 1800, tags: [`category-${id}`] } },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  static async getCategories() {
    const { data, error } = await server.categories.index.get();

    if (error) {
      throw error;
    }

    return data;
  }

  static async createCategory<
    T extends Parameters<typeof server.categories.index.post>[0],
  >(body: T) {
    const { data, error } = await server.categories.index.post(body);

    if (error) {
      throw error;
    }

    return data;
  }

  static async deleteCategory(id: string) {
    const { data, error } = await server.categories({ id }).delete();

    if (error) {
      throw error;
    }

    return data;
  }

  static async hideCategory(id: string) {
    const { data, error } = await server.categories({ id }).hide.post();

    if (error) {
      throw error;
    }

    return data;
  }

  static async showCategory(id: string) {
    const { data, error } = await server.categories({ id }).show.post();

    if (error) {
      throw error;
    }

    return data;
  }
}
