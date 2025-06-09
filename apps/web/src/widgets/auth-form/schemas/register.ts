import * as z from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1),
  surname: z.string().trim().min(1),
  email: z.string().trim().email(),
  login: z.string().trim().min(6),
  password: z.string().trim().min(6),
});
