import type { PopoverItemParams } from '@/types/utils/popover/popover-item';

type PopoverStatesHistoryItem = {
  title?: string;

  items: PopoverItemParams[];
};

export class PopoverStatesHistory {
  private history: PopoverStatesHistoryItem[] = [];

  public push(state: PopoverStatesHistoryItem): void {
    this.history.push(state);
  }

  public pop(): PopoverStatesHistoryItem | undefined {
    return this.history.pop();
  }

  public get currentTitle(): string | undefined {
    if (this.history.length === 0) {
      return '';
    }

    return this.history[this.history.length - 1].title;
  }

  public get currentItems(): PopoverItemParams[] {
    if (this.history.length === 0) {
      return [];
    }

    return this.history[this.history.length - 1].items;
  }

  public reset(): void {
    while (this.history.length > 1) {
      this.pop();
    }
  }
}
