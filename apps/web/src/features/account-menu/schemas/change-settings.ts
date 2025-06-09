import * as z from 'zod';

export const changeSettingsSchema = z.object({
  avatar: z.union([z.string().nullable(), z.instanceof(File)]),
  name: z.string().trim().min(1),
  surname: z.string().trim().min(1),
});
