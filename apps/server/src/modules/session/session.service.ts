import { prisma } from '@repo/database';

import { config } from '@/config';
import { UnauthorizedError } from '@/errors/unauthorized';

export class SessionService {
  private static getExpirationDate(seconds: number) {
    const date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    return date;
  }

  static async getSessionByToken(token: string) {
    const session = await prisma.session.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      throw new UnauthorizedError(
        `Session with the token ${token} was not found`,
      );
    }

    return session;
  }

  static async createSession(userId: string, token: string) {
    return await prisma.session.create({
      data: {
        token,
        user: {
          connect: {
            id: userId,
          },
        },
        expiresAt: this.getExpirationDate(config.rjwt.expires),
      },
    });
  }

  static async updateSessionByToken(sessionId: string, token: string) {
    return await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        token,
      },
    });
  }

  static async deleteSessionByToken(token: string) {
    return await prisma.session.delete({
      where: {
        token,
      },
    });
  }

  static async deleteExpiredSessions() {
    return await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
