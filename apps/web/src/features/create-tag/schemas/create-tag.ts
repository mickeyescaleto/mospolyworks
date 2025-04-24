import * as z from 'zod';

export const createTagSchema = z.object({
  label: z.string().trim().min(1),
  categoryId: z.string().trim().min(1),
});
