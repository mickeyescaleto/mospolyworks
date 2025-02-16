import EventsDispatcher from '@repo/editor/components/utils/events';

import type { EditorEventMap } from '@repo/editor/components/events';
import type { EditorConfig } from '@repo/editor/types/configs/editor-config';

export type ModuleConfig = {
  config: EditorConfig;
  eventsDispatcher: EventsDispatcher<EditorEventMap>;
};
