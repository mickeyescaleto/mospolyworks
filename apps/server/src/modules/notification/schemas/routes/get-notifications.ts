import { t } from 'elysia';

import { Notification } from '@/modules/notification/schemas/notification';

export const GetNotificationsResponse = t.Array(Notification);
