import { prisma } from '@repo/database';

import { config } from '@/config';
import { UnauthorizedError } from '@/errors/unauthorized';
import { getExpirationDate } from '@/utilities/get-expiration-date';

export abstract class SessionService {
  static async createSession(userId: string, token: string) {
    const session = await prisma.session.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        token,
        expiresAt: getExpirationDate(config.rjwt.expires),
      },
      select: {
        id: true,
      },
    });

    return session;
  }

  static async getSessionByToken(token: string) {
    const session = await prisma.session.findUnique({
      where: {
        token,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            roles: true,
          },
        },
      },
    });

    if (!session) {
      throw new UnauthorizedError(
        `Session with the token ${token} was not found`,
      );
    }

    return session;
  }

  static async updateSessionByToken(sessionId: string, token: string) {
    const session = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        token,
      },
      select: {
        id: true,
      },
    });

    return session;
  }

  static async deleteSessionByToken(token: string) {
    const session = await prisma.session.delete({
      where: {
        token,
      },
      select: {
        id: true,
      },
    });

    return session;
  }

  static async deleteExpiredSessions() {
    const sessions = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return sessions;
  }
}
