import Module from '@/components/__module';

import type { Listeners } from '@/types/api/listeners';

export default class ListenersAPI extends Module {
  public get methods(): Listeners {
    return {
      on: (element: HTMLElement, eventType, handler, useCapture): string =>
        this.on(element, eventType, handler, useCapture),
      off: (element, eventType, handler, useCapture): void =>
        this.off(element, eventType, handler, useCapture),
      offById: (id): void => this.offById(id),
    };
  }

  public on(
    element: HTMLElement,
    eventType: string,
    handler: () => void,
    useCapture?: boolean,
  ): string {
    return this.listeners.on(element, eventType, handler, useCapture);
  }

  public off(
    element: Element,
    eventType: string,
    handler: () => void,
    useCapture?: boolean,
  ): void {
    this.listeners.off(element, eventType, handler, useCapture);
  }

  public offById(id: string): void {
    this.listeners.offById(id);
  }
}
