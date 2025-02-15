import Dom from '@/components/dom';
import * as utilities from '@/components/utilities';
import SelectionUtils from '@/components/selection';

export default class DomIterator {
  public static directions = {
    RIGHT: 'right',
    LEFT: 'left',
  };

  private focusedCssClass: string;

  private cursor = -1;

  private items: HTMLElement[] = [];

  constructor(nodeList: HTMLElement[], focusedCssClass: string) {
    this.items = nodeList || [];
    this.focusedCssClass = focusedCssClass;
  }

  public get currentItem(): HTMLElement {
    if (this.cursor === -1) {
      return null;
    }

    return this.items[this.cursor];
  }

  public setCursor(cursorPosition: number): void {
    if (cursorPosition < this.items.length && cursorPosition >= -1) {
      this.dropCursor();
      this.cursor = cursorPosition;
      this.items[this.cursor].classList.add(this.focusedCssClass);
    }
  }

  public setItems(nodeList: HTMLElement[]): void {
    this.items = nodeList;
  }

  public next(): void {
    this.cursor = this.leafNodesAndReturnIndex(DomIterator.directions.RIGHT);
  }

  public previous(): void {
    this.cursor = this.leafNodesAndReturnIndex(DomIterator.directions.LEFT);
  }

  public dropCursor(): void {
    if (this.cursor === -1) {
      return;
    }

    this.items[this.cursor].classList.remove(this.focusedCssClass);
    this.cursor = -1;
  }

  private leafNodesAndReturnIndex(direction: string): number {
    if (this.items.length === 0) {
      return this.cursor;
    }

    let focusedButtonIndex = this.cursor;

    if (focusedButtonIndex === -1) {
      focusedButtonIndex = direction === DomIterator.directions.RIGHT ? -1 : 0;
    } else {
      this.items[focusedButtonIndex].classList.remove(this.focusedCssClass);
    }

    if (direction === DomIterator.directions.RIGHT) {
      focusedButtonIndex = (focusedButtonIndex + 1) % this.items.length;
    } else {
      focusedButtonIndex =
        (this.items.length + focusedButtonIndex - 1) % this.items.length;
    }

    if (Dom.canSetCaret(this.items[focusedButtonIndex])) {
      utilities.delay(
        () => SelectionUtils.setCursor(this.items[focusedButtonIndex]),
        50,
      )();
    }

    this.items[focusedButtonIndex].classList.add(this.focusedCssClass);

    return focusedButtonIndex;
  }
}
