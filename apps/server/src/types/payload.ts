import { Static } from 'elysia';
import { tPayload } from '@/schemas/payload';

export type Payload = Static<typeof tPayload>;
