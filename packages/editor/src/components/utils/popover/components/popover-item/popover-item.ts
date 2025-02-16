import * as tooltip from '@repo/editor/components/utils/tooltip';
import { Hint } from '@repo/editor/components/utils/popover/components/hint';

import { HintPosition } from '@repo/editor/types/utils/popover/hint';
import type { PopoverItemParams } from '@repo/editor/types/utils/popover/popover-item';

export abstract class PopoverItem {
  constructor(protected readonly params?: PopoverItemParams) {}

  public get name(): string | undefined {
    if (this.params === undefined) {
      return;
    }
    if ('name' in this.params) {
      return this.params.name;
    }
  }

  public destroy(): void {
    tooltip.hide();
  }

  public onChildrenOpen(): void {
    if (this.params === undefined) {
      return;
    }

    if (
      'children' in this.params &&
      typeof this.params.children?.onOpen === 'function'
    ) {
      this.params.children.onOpen();
    }
  }

  public onChildrenClose(): void {
    if (this.params === undefined) {
      return;
    }

    if (
      'children' in this.params &&
      typeof this.params.children?.onClose === 'function'
    ) {
      this.params.children.onClose();
    }
  }

  public handleClick(): void {
    if (this.params === undefined) {
      return;
    }

    if (!('onActivate' in this.params)) {
      return;
    }

    this.params.onActivate?.(this.params);
  }

  protected addHint(
    itemElement: HTMLElement,
    hintData: { title: string; description?: string; position: HintPosition },
  ): void {
    const content = new Hint(hintData);

    tooltip.onHover(itemElement, content.getElement(), {
      placement: hintData.position,
      hidingDelay: 100,
    });
  }

  public abstract getElement(): HTMLElement | null;

  public abstract toggleHidden(isHidden: boolean): void;

  public get children(): PopoverItemParams[] {
    return this.params !== undefined &&
      'children' in this.params &&
      this.params.children?.items !== undefined
      ? this.params.children.items
      : [];
  }

  public get hasChildren(): boolean {
    return this.children.length > 0;
  }

  public get isChildrenOpen(): boolean {
    return (
      this.params !== undefined &&
      'children' in this.params &&
      this.params.children?.isOpen === true
    );
  }

  public get isChildrenFlippable(): boolean {
    if (this.params === undefined) {
      return false;
    }

    if (!('children' in this.params)) {
      return false;
    }

    if (this.params.children?.isFlippable === false) {
      return false;
    }

    return true;
  }

  public get isChildrenSearchable(): boolean {
    return (
      this.params !== undefined &&
      'children' in this.params &&
      this.params.children?.searchable === true
    );
  }

  public get closeOnActivate(): boolean | undefined {
    return (
      this.params !== undefined &&
      'closeOnActivate' in this.params &&
      this.params.closeOnActivate
    );
  }

  public get isActive(): boolean {
    if (this.params === undefined) {
      return false;
    }

    if (!('isActive' in this.params)) {
      return false;
    }

    if (typeof this.params.isActive === 'function') {
      return this.params.isActive();
    }

    return this.params.isActive === true;
  }
}
