import EventsDispatcher from '@/components/utils/events';

import type { EditorEventMap } from '@/components/events';
import type { EditorConfig } from '@/types/configs/editor-config';

export type ModuleConfig = {
  config: EditorConfig;
  eventsDispatcher: EventsDispatcher<EditorEventMap>;
};
