import { t } from 'elysia';

export const Config = t.Object({
  app: t.Object({
    port: t.Number(),
  }),
  ajwt: t.Object({
    secret: t.String(),
    expires: t.Number(),
  }),
  rjwt: t.Object({
    secret: t.String(),
    expires: t.Number(),
  }),
  s3: t.Object({
    accessKeyId: t.String(),
    secretAccessKey: t.String(),
    endpoint: t.String(),
    bucket: t.String(),
    region: t.String(),
    domain: t.String(),
  }),
});

export type IConfig = typeof Config.static;
