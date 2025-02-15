export type Listeners = {
  on(
    element: Element,
    eventType: string,
    handler: (event?: Event) => void,
    useCapture?: boolean,
  ): string;
  off(
    element: Element,
    eventType: string,
    handler: (event?: Event) => void,
    useCapture?: boolean,
  ): void;
  offById(id: string): void;
};
