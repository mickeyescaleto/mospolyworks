import Module from '@repo/editor/components/__module';

import type { Events } from '@repo/editor/types/api/events';

export default class EventsAPI extends Module {
  public get methods(): Events {
    return {
      emit: (eventName: string, data: object): void =>
        this.emit(eventName, data),
      off: (eventName: string, callback: () => void): void =>
        this.off(eventName, callback),
      on: (eventName: string, callback: () => void): void =>
        this.on(eventName, callback),
    };
  }

  public on(eventName, callback): void {
    this.eventsDispatcher.on(eventName, callback);
  }

  public emit(eventName, data): void {
    this.eventsDispatcher.emit(eventName, data);
  }

  public off(eventName, callback): void {
    this.eventsDispatcher.off(eventName, callback);
  }
}
