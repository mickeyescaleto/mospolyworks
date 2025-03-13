import { prisma } from '@repo/database';

import { config } from '@/config';
import { getExpirationDate } from '@/utilities/get-expiration-date';

export abstract class SessionService {
  static async getSessionByToken(token: string) {
    return await prisma.session.findUnique({ where: { token } });
  }

  static async createSession(userId: string, token: string) {
    return await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt: getExpirationDate(config.rjwt.expires),
      },
    });
  }

  static async updateSessionByToken(token: string, newToken: string) {
    return await prisma.session.update({
      where: { token },
      data: {
        token: newToken,
        expiresAt: getExpirationDate(config.rjwt.expires),
      },
    });
  }

  static async deleteSessionByToken(token: string) {
    return await prisma.session.delete({ where: { token } });
  }

  static async deleteExpiredSessions() {
    return await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
