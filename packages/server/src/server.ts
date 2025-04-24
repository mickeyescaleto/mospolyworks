import { treaty } from '@elysiajs/eden';
import superjson from 'superjson';

import { type Application } from 'server';

export const server = treaty<Application>(process.env.NEXT_PUBLIC_SERVER_URL!, {
  fetch: { credentials: 'include' },
  async onResponse(response) {
    if (response.ok) {
      return superjson.parse(await response.text());
    }
  },
});
