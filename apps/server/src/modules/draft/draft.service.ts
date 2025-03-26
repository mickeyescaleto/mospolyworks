import { NotFoundError } from 'elysia';

import { prisma } from '@repo/database';

import { BadRequestError } from '@/errors/bad-request';
import { toInputJsonValue } from '@/utilities/to-input-json-value';
import { type UpdateDraftBody } from '@/modules/draft/schemas/update-draft';

export abstract class DraftService {
  static async getDrafts(authorId: string) {
    const drafts = await prisma.draft.findMany({
      where: {
        author: {
          id: authorId,
        },
      },
      select: {
        id: true,
        title: true,
        image: true,
      },
    });

    return drafts;
  }

  static async getDraft(draftId: string, authorId: string) {
    const draft = await prisma.draft.findUnique({
      where: {
        id: draftId,
        author: {
          id: authorId,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        link: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        draftPartners: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        draftTags: {
          select: {
            tag: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!draft) {
      throw new NotFoundError(`Draft with the ID ${draftId} was not found`);
    }

    return draft;
  }

  static async createDraft(authorId: string) {
    const draft = await prisma.draft.create({
      data: {
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return draft;
  }

  static async updateDraft(
    draftId: string,
    authorId: string,
    data: UpdateDraftBody,
  ) {
    const { categoryId, draftPartners, draftTags, ...rest } = data;

    const draft = await prisma.draft.update({
      where: {
        id: draftId,
        author: {
          id: authorId,
        },
      },
      data: {
        ...rest,
        category: categoryId
          ? {
              connect: {
                id: categoryId,
              },
            }
          : {
              disconnect: true,
            },
        draftPartners:
          draftPartners && draftPartners.length > 0
            ? {
                deleteMany: {},
                create: draftPartners.map((partnerId) => ({
                  user: {
                    connect: {
                      id: partnerId,
                    },
                  },
                })),
              }
            : {
                deleteMany: {},
              },
        draftTags:
          draftTags && draftTags.length > 0
            ? {
                deleteMany: {},
                create: draftTags.map((tagId) => ({
                  tag: {
                    connect: {
                      id: tagId,
                    },
                  },
                })),
              }
            : {
                deleteMany: {},
              },
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        link: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        draftPartners: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        draftTags: {
          select: {
            tag: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return draft;
  }

  static async deleteDraft(draftId: string, authorId: string) {
    const draft = await prisma.draft.delete({
      where: {
        id: draftId,
        author: {
          id: authorId,
        },
      },
      select: {
        id: true,
      },
    });

    return draft;
  }

  static async publishDraft(draftId: string, authorId: string) {
    const project = await prisma.$transaction(async (prisma) => {
      const draft = await prisma.draft.findUnique({
        where: {
          id: draftId,
          author: {
            id: authorId,
          },
        },
        include: {
          category: true,
          draftPartners: {
            include: {
              user: true,
            },
          },
          draftTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (!draft) {
        throw new NotFoundError(`Draft with the ID ${draftId} was not found`);
      }

      const { draftPartners, draftTags, ...rest } = draft;

      if (
        !rest.title ||
        !rest.image ||
        !rest.category ||
        !rest.content ||
        !Array.isArray(rest.content) ||
        rest.content.length === 0 ||
        rest.content.some((block) => !block)
      ) {
        throw new BadRequestError(
          `Draft with the ID ${draftId} cannot be published: required fields are missing`,
        );
      }

      const project = await prisma.project.create({
        data: {
          id: rest.id,
          title: rest.title,
          content: rest.content.map(toInputJsonValue),
          image: rest.image,
          link: rest.link,
          author: {
            connect: {
              id: rest.authorId,
            },
          },
          category: {
            connect: rest.category,
          },
          projectPartners:
            draftPartners.length > 0
              ? {
                  create: draftPartners.map((partner) => ({
                    user: {
                      connect: {
                        id: partner.user.id,
                      },
                    },
                  })),
                }
              : undefined,
          projectTags:
            draftTags.length > 0
              ? {
                  create: draftTags.map((tag) => ({
                    tag: {
                      connect: {
                        id: tag.tag.id,
                      },
                    },
                  })),
                }
              : undefined,
        },
        select: {
          id: true,
          title: true,
          content: true,
          image: true,
          link: true,
          status: true,
          rejectionComment: true,
          views: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              surname: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              title: true,
            },
          },
          projectPartners: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  avatar: true,
                },
              },
            },
          },
          projectTags: {
            select: {
              tag: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      await prisma.draft.delete({
        where: {
          id: draftId,
          author: {
            id: authorId,
          },
        },
      });

      return project;
    });

    return project;
  }
}
