import Listeners from '@repo/editor/components/utils/listeners';
import EventsDispatcher from '@repo/editor/components/utils/events';

import type { EditorEventMap } from '@repo/editor/components/events';
import type { EditorModules } from '@repo/editor/types-internal/editor-modules';
import type { ModuleConfig } from '@repo/editor/types-internal/module-config';
import type { EditorConfig } from '@repo/editor/types/configs/editor-config';

export type ModuleNodes = object;

export default class Module<
  T extends ModuleNodes = Record<string, HTMLElement>,
> {
  public nodes: T = {} as any;

  protected Editor: EditorModules;

  protected config: EditorConfig;

  protected eventsDispatcher: EventsDispatcher<EditorEventMap>;

  protected listeners: Listeners = new Listeners();

  protected readOnlyMutableListeners = {
    on: (
      element: EventTarget,
      eventType: string,
      handler: (event: Event) => void,
      options: boolean | AddEventListenerOptions = false,
    ): void => {
      this.mutableListenerIds.push(
        this.listeners.on(element, eventType, handler, options),
      );
    },
    clearAll: (): void => {
      for (const id of this.mutableListenerIds) {
        this.listeners.offById(id);
      }

      this.mutableListenerIds = [];
    },
  };

  private mutableListenerIds: string[] = [];

  constructor({ config, eventsDispatcher }: ModuleConfig) {
    if (new.target === Module) {
      throw new TypeError(
        'Constructors for abstract class Module are not allowed.',
      );
    }

    this.config = config;
    this.eventsDispatcher = eventsDispatcher;
  }

  public set state(Editor: EditorModules) {
    this.Editor = Editor;
  }

  public removeAllNodes(): void {
    for (const key in this.nodes) {
      const node = this.nodes[key];

      if (node instanceof HTMLElement) {
        node.remove();
      }
    }
  }

  protected get isRtl(): boolean {
    return this.config.i18n.direction === 'rtl';
  }
}
