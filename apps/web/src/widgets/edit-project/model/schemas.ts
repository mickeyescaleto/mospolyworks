import { z } from 'zod';

const draftCommonFields = z.object({
  cover: z.union([z.string().nullable(), z.instanceof(File)]),
  title: z.string().max(96).nullable(),
  titleAlignment: z.enum(['left', 'center', 'right', 'justify']),
  content: z.any().array(),
  categoryId: z.string().nullable(),
  link: z.string().nullable(),
  tags: z.string().array(),
  partners: z.string().array(),
});

const publishedCommonFields = z.object({
  cover: z.union([z.string().min(1), z.instanceof(File)]),
  title: z.string().max(96).min(1),
  titleAlignment: z.enum(['left', 'center', 'right', 'justify']),
  content: z.any().array().min(1),
  categoryId: z.string().min(1),
  link: z.string().nullable(),
  tags: z.string().array(),
  partners: z.string().array(),
});

export const editProjectFormSchema = z.discriminatedUnion('status', [
  draftCommonFields.extend({
    status: z.literal('unpublished'),
  }),
  draftCommonFields.extend({
    status: z.literal('rejected'),
  }),
  draftCommonFields.extend({
    status: z.literal('corrected'),
  }),
  publishedCommonFields.extend({
    status: z.literal('published'),
  }),
  publishedCommonFields.extend({
    status: z.literal('verified'),
  }),
]);
