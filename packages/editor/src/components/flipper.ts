import DomIterator from '@repo/editor/components/dom-iterator';
import * as utilities from '@repo/editor/components/utilities';

export type FlipperOptions = {
  focusedItemClass?: string;
  items?: HTMLElement[];
  activateCallback?(item: HTMLElement): void;
  allowedKeys?: number[];
};

export default class Flipper {
  public get isActivated(): boolean {
    return this.activated;
  }

  private readonly iterator: DomIterator | null = null;

  private activated = false;

  private readonly allowedKeys: number[];

  private readonly activateCallback: (item: HTMLElement) => void;

  private flipCallbacks: Array<() => void> = [];

  constructor(options: FlipperOptions) {
    this.iterator = new DomIterator(options.items, options.focusedItemClass);
    this.activateCallback = options.activateCallback;
    this.allowedKeys = options.allowedKeys || Flipper.usedKeys;
  }

  public static get usedKeys(): number[] {
    return [
      utilities.keyCodes.TAB,
      utilities.keyCodes.LEFT,
      utilities.keyCodes.RIGHT,
      utilities.keyCodes.ENTER,
      utilities.keyCodes.UP,
      utilities.keyCodes.DOWN,
    ];
  }

  public activate(items?: HTMLElement[], cursorPosition?: number): void {
    this.activated = true;
    if (items) {
      this.iterator.setItems(items);
    }

    if (cursorPosition !== undefined) {
      this.iterator.setCursor(cursorPosition);
    }

    document.addEventListener('keydown', this.onKeyDown, true);
  }

  public deactivate(): void {
    this.activated = false;
    this.dropCursor();

    document.removeEventListener('keydown', this.onKeyDown);
  }

  public focusFirst(): void {
    this.dropCursor();
    this.flipRight();
  }

  public flipLeft(): void {
    this.iterator.previous();
    this.flipCallback();
  }

  public flipRight(): void {
    this.iterator.next();
    this.flipCallback();
  }

  public hasFocus(): boolean {
    return !!this.iterator.currentItem;
  }

  public onFlip(cb: () => void): void {
    this.flipCallbacks.push(cb);
  }

  public removeOnFlip(cb: () => void): void {
    this.flipCallbacks = this.flipCallbacks.filter((fn) => fn !== cb);
  }

  private dropCursor(): void {
    this.iterator.dropCursor();
  }

  private onKeyDown = (event): void => {
    const isReady = this.isEventReadyForHandling(event);

    if (!isReady) {
      return;
    }

    if (Flipper.usedKeys.includes(event.keyCode)) {
      event.preventDefault();
    }

    switch (event.keyCode) {
      case utilities.keyCodes.TAB:
        this.handleTabPress(event);
        break;
      case utilities.keyCodes.LEFT:
      case utilities.keyCodes.UP:
        this.flipLeft();
        break;
      case utilities.keyCodes.RIGHT:
      case utilities.keyCodes.DOWN:
        this.flipRight();
        break;
      case utilities.keyCodes.ENTER:
        this.handleEnterPress(event);
        break;
    }
  };

  private isEventReadyForHandling(event: KeyboardEvent): boolean {
    return this.activated && this.allowedKeys.includes(event.keyCode);
  }

  private handleTabPress(event: KeyboardEvent): void {
    const shiftKey = event.shiftKey,
      direction = shiftKey
        ? DomIterator.directions.LEFT
        : DomIterator.directions.RIGHT;

    switch (direction) {
      case DomIterator.directions.RIGHT:
        this.flipRight();
        break;
      case DomIterator.directions.LEFT:
        this.flipLeft();
        break;
    }
  }

  private handleEnterPress(event: KeyboardEvent): void {
    if (!this.activated) {
      return;
    }

    if (this.iterator.currentItem) {
      event.stopPropagation();
      event.preventDefault();
      this.iterator.currentItem.click();
    }

    if (utilities.isFunction(this.activateCallback)) {
      this.activateCallback(this.iterator.currentItem);
    }
  }

  private flipCallback(): void {
    if (this.iterator.currentItem) {
      this.iterator.currentItem.scrollIntoViewIfNeeded();
    }

    this.flipCallbacks.forEach((cb) => cb());
  }
}
