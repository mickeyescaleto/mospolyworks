import * as z from 'zod';

export const rejectProjectSchema = z.object({
  rejectionComment: z.string().trim().min(1),
});
