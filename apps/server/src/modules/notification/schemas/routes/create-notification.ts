import { t } from 'elysia';

import { Notification } from '@/modules/notification/schemas/notification';

export const CreateNotificationBody = t.Pick(Notification, [
  'title',
  'content',
  'link',
]);

export type ICreateNotificationBody = typeof CreateNotificationBody.static;
