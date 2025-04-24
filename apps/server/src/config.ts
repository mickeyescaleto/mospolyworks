import { Value } from '@sinclair/typebox/value';

import { getLogger } from '@/utilities/logger';
import { type IConfig, Config } from '@/schemas/config';

const logger = getLogger('Configuration');

function getConfig(): IConfig {
  try {
    const config: IConfig = {
      app: {
        port: +Bun.env.SERVER_PORT!,
      },
      external: {
        endpoint: Bun.env.MOSPOLYTECH_ENDPOINT!,
      },
      ajwt: {
        secret: Bun.env.JWT_ACCESS_SECRET!,
        expires: +Bun.env.JWT_ACCESS_EXPIRES!,
      },
      rjwt: {
        secret: Bun.env.JWT_REFRESH_SECRET!,
        expires: +Bun.env.JWT_REFRESH_EXPIRES!,
      },
      s3: {
        accessKeyId: Bun.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY!,
        endpoint: Bun.env.S3_ENDPOINT!,
        bucket: Bun.env.S3_BUCKET!,
        region: Bun.env.S3_REGION!,
        domain: Bun.env.S3_DOMAIN!,
      },
      fake: {
        agent: Bun.env.FAKE_AGENT!,
      },
    };

    return Value.Decode(Config, config);
  } catch (error) {
    logger.error('Application configuration was declared incorrectly');
    throw error;
  }
}

export const config = getConfig();
