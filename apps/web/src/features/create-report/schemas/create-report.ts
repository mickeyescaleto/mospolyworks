import * as z from 'zod';

export const createReportSchema = z.object({
  content: z.string().trim().min(1),
});
