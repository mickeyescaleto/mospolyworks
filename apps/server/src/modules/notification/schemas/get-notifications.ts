import { t } from 'elysia';

import { tNotification } from '@/modules/notification/schemas/notification';

export const tGetNotificationsResponse = t.Array(tNotification);
