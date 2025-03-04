import * as z from 'zod';

export const userAuthSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string().trim().min(1),
});
