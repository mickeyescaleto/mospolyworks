import { TagService } from '@/entities/tag/api/tag-service';

export type Tag = Awaited<ReturnType<typeof TagService.getTags>>[number];
