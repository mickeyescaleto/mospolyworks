import * as utilities from '@repo/editor/components/utilities';

export type ListenerData = {
  id: string;
  element: EventTarget;
  eventType: string;
  handler(event: Event): void;
  options: boolean | AddEventListenerOptions;
};

export default class Listeners {
  private allListeners: ListenerData[] = [];

  public on(
    element: EventTarget,
    eventType: string,
    handler: (event: Event) => void,
    options: boolean | AddEventListenerOptions = false,
  ): string {
    const id = utilities.generateId('l');
    const assignedEventData = {
      id,
      element,
      eventType,
      handler,
      options,
    };

    const alreadyExist = this.findOne(element, eventType, handler);

    if (alreadyExist) {
      return;
    }

    this.allListeners.push(assignedEventData);
    element.addEventListener(eventType, handler, options);

    return id;
  }

  public off(
    element: EventTarget,
    eventType: string,
    handler?: (event: Event) => void,
    options?: boolean | AddEventListenerOptions,
  ): void {
    const existingListeners = this.findAll(element, eventType, handler);

    existingListeners.forEach((listener, i) => {
      const index = this.allListeners.indexOf(existingListeners[i]);

      if (index > -1) {
        this.allListeners.splice(index, 1);

        listener.element.removeEventListener(
          listener.eventType,
          listener.handler,
          listener.options,
        );
      }
    });
  }

  public offById(id: string): void {
    const listener = this.findById(id);

    if (!listener) {
      return;
    }

    listener.element.removeEventListener(
      listener.eventType,
      listener.handler,
      listener.options,
    );
  }

  public findOne(
    element: EventTarget,
    eventType?: string,
    handler?: (event: Event) => void,
  ): ListenerData {
    const foundListeners = this.findAll(element, eventType, handler);

    return foundListeners.length > 0 ? foundListeners[0] : null;
  }

  public findAll(
    element: EventTarget,
    eventType?: string,
    handler?: (event: Event) => void,
  ): ListenerData[] {
    let found;
    const foundByEventTargets = element ? this.findByEventTarget(element) : [];

    if (element && eventType && handler) {
      found = foundByEventTargets.filter(
        (event) => event.eventType === eventType && event.handler === handler,
      );
    } else if (element && eventType) {
      found = foundByEventTargets.filter(
        (event) => event.eventType === eventType,
      );
    } else {
      found = foundByEventTargets;
    }

    return found;
  }

  public removeAll(): void {
    this.allListeners.map((current) => {
      current.element.removeEventListener(
        current.eventType,
        current.handler,
        current.options,
      );
    });

    this.allListeners = [];
  }

  public destroy(): void {
    this.removeAll();
  }

  private findByEventTarget(element: EventTarget): ListenerData[] {
    return this.allListeners.filter((listener) => {
      if (listener.element === element) {
        return listener;
      }
    });
  }

  private findByType(eventType: string): ListenerData[] {
    return this.allListeners.filter((listener) => {
      if (listener.eventType === eventType) {
        return listener;
      }
    });
  }

  private findByHandler(handler: (event: Event) => void): ListenerData[] {
    return this.allListeners.filter((listener) => {
      if (listener.handler === handler) {
        return listener;
      }
    });
  }

  private findById(id: string): ListenerData {
    return this.allListeners.find((listener) => listener.id === id);
  }
}
