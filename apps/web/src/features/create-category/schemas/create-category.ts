import * as z from 'zod';

export const createCategorySchema = z.object({
  label: z.string().trim().min(1),
});
