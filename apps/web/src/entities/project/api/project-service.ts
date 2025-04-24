import { server } from '@repo/server';

import { type GetExhibitionProjectsQuery } from '@/entities/project/types/get-exhibition-projects';
import { type GetProjectsQuery } from '@/entities/project/types/get-projects';
import { type GetProjectsForReviewQuery } from '@/entities/project/types/get-projects-for-review';

export class ProjectService {
  static async getExhibitionProjects(query: GetExhibitionProjectsQuery) {
    query = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value),
    );

    const { data, error } = await server.projects.exhibitions.get({ query });

    if (error) {
      throw error;
    }

    return data;
  }

  static async getExhibitionProjectById(id: string) {
    const { data, error } = await server.projects.exhibitions({ id }).get();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getProjectLike(id: string) {
    const { data, error } = await server.projects
      .exhibitions({ id })
      .like.get();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getProjects(query: GetProjectsQuery) {
    query = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value),
    );

    const { data, error } = await server.projects.index.get({ query });

    if (error) {
      throw error;
    }

    return data;
  }

  static async createProject() {
    const { data, error } = await server.projects.index.post();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getProjectById(id: string) {
    const { data, error } = await server.projects({ id }).get();

    if (error) {
      throw error;
    }

    return data;
  }

  static async publishProject(id: string) {
    const { data, error } = await server.projects({ id }).publish.post();

    if (error) {
      throw error;
    }

    return data;
  }

  static async unpublishProject(id: string) {
    const { data, error } = await server.projects({ id }).unpublish.post();

    if (error) {
      throw error;
    }

    return data;
  }

  static async editProject(
    id: string,
    body: Parameters<ReturnType<typeof server.projects>['put']>[0],
  ) {
    const { data, error } = await server.projects({ id }).put(body);

    if (error) {
      throw error;
    }

    return data;
  }

  static async deleteProject(id: string) {
    const { data, error } = await server.projects({ id }).delete();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getProjectsForReview(query: GetProjectsForReviewQuery) {
    query = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value),
    );

    const { data, error } = await server.projects['for-review'].get({ query });

    if (error) {
      throw error;
    }

    return data;
  }

  static async approveProject(id: string) {
    const { data, error } = await server.projects({ id }).approve.post();

    if (error) {
      throw error;
    }

    return data;
  }

  static async rejectProject<
    T extends Parameters<
      ReturnType<typeof server.projects>['reject']['post']
    >[0],
  >(id: string, body: T) {
    const { data, error } = await server.projects({ id }).reject.post(body);

    if (error) {
      throw error;
    }

    return data;
  }
}
