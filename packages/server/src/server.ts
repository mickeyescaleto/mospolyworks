import { treaty } from '@elysiajs/eden';

import { App } from 'server';

export const server = treaty<App>(process.env.NEXT_PUBLIC_SERVER_URL!, {
  fetch: { credentials: 'include' },
});
