type Config = {
  app: {
    port: number;
  };
  external: {
    endpoint: string;
  };
  ajwt: {
    secret: string;
    expires: number;
  };
  rjwt: {
    secret: string;
    expires: number;
  };
};

export const config: Config = {
  app: {
    port: +Bun.env.SERVER_PORT!,
  },
  external: {
    endpoint: Bun.env.EXTERNAL_API_ENDPOINT!,
  },
  ajwt: {
    secret: Bun.env.JWT_ACCESS_SECRET!,
    expires: +Bun.env.JWT_ACCESS_EXPIRES!,
  },
  rjwt: {
    secret: Bun.env.JWT_REFRESH_SECRET!,
    expires: +Bun.env.JWT_REFRESH_EXPIRES!,
  },
};
