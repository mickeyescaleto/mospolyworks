import { treaty } from '@elysiajs/eden';
import { type App } from 'server';

export const server = treaty<App>('http://localhost:3000', {
  fetch: { credentials: 'include' },
});
