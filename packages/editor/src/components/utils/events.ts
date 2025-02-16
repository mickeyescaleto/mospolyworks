import { isEmpty } from '@repo/editor/components/utilities';

type Listener<Data> = (data: Data) => void;

type Subscriptions<EventMap> = {
  [Key in keyof EventMap]: Listener<EventMap[Key]>[];
};

export default class EventsDispatcher<EventMap> {
  private subscribers = <Subscriptions<EventMap>>{};

  public on<Name extends keyof EventMap>(
    eventName: Name,
    callback: Listener<EventMap[Name]>,
  ): void {
    if (!(eventName in this.subscribers)) {
      this.subscribers[eventName] = [];
    }

    this.subscribers[eventName].push(callback);
  }

  public once<Name extends keyof EventMap>(
    eventName: Name,
    callback: Listener<EventMap[Name]>,
  ): void {
    if (!(eventName in this.subscribers)) {
      this.subscribers[eventName] = [];
    }

    const wrappedCallback = (data: EventMap[typeof eventName]): void => {
      const result = callback(data);

      const indexOfHandler =
        this.subscribers[eventName].indexOf(wrappedCallback);

      if (indexOfHandler !== -1) {
        this.subscribers[eventName].splice(indexOfHandler, 1);
      }

      return result;
    };

    this.subscribers[eventName].push(wrappedCallback);
  }

  public emit<Name extends keyof EventMap>(
    eventName: Name,
    data?: EventMap[Name],
  ): void {
    if (isEmpty(this.subscribers) || !this.subscribers[eventName]) {
      return;
    }

    this.subscribers[eventName].reduce((previousData, currentHandler) => {
      const newData = currentHandler(previousData);

      return newData !== undefined ? newData : previousData;
    }, data);
  }

  public off<Name extends keyof EventMap>(
    eventName: Name,
    callback: Listener<EventMap[Name]>,
  ): void {
    if (this.subscribers[eventName] === undefined) {
      console.warn(
        `EventDispatcher .off(): there is no subscribers for event "${eventName.toString()}". Probably, .off() called before .on()`,
      );

      return;
    }

    for (let i = 0; i < this.subscribers[eventName].length; i++) {
      if (this.subscribers[eventName][i] === callback) {
        delete this.subscribers[eventName][i];
        break;
      }
    }
  }

  public destroy(): void {
    this.subscribers = {} as Subscriptions<EventMap>;
  }
}
