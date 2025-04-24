import * as z from 'zod';

export const authSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string().trim().min(1),
});
