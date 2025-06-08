import * as z from 'zod';

export const authSchema = z.object({
  login: z.string().trim().min(6),
  password: z.string().trim().min(6),
});
