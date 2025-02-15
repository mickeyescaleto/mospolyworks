import { isMobileScreen } from '@/components/utilities';
import { PopoverItem } from '@/components/utils/popover/components/popover-item';
import { PopoverItemDefault } from '@/components/utils/popover/components/popover-item';
import { PopoverItemHtml } from '@/components/utils/popover/components/popover-item/popover-item-html/popover-item-html';
import { PopoverDesktop } from '@/components/utils/popover/popover-desktop';
import { CSSVariables, css } from '@/components/utils/popover/popover.const';
import { PopoverItemType } from '@/types/utils/popover/popover-item-type';

import type { PopoverParams } from '@/types/utils/popover/popover';

export class PopoverInline extends PopoverDesktop {
  constructor(params: PopoverParams) {
    const isHintEnabled = !isMobileScreen();

    super(
      {
        ...params,
        class: css.popoverInline,
      },
      {
        [PopoverItemType.Default]: {
          wrapperTag: 'button',
          hint: {
            position: 'top',
            alignment: 'center',
            enabled: isHintEnabled,
          },
        },
        [PopoverItemType.Html]: {
          hint: {
            position: 'top',
            alignment: 'center',
            enabled: isHintEnabled,
          },
        },
      },
    );

    this.items.forEach((item) => {
      if (
        !(item instanceof PopoverItemDefault) &&
        !(item instanceof PopoverItemHtml)
      ) {
        return;
      }

      if (item.hasChildren && item.isChildrenOpen) {
        this.showNestedItems(item);
      }
    });
  }

  public get offsetLeft(): number {
    if (this.nodes.popoverContainer === null) {
      return 0;
    }

    return this.nodes.popoverContainer.offsetLeft;
  }

  public override show(): void {
    if (this.nestingLevel === 0) {
      this.nodes.popover.style.setProperty(
        CSSVariables.InlinePopoverWidth,
        this.size.width + 'px',
      );
    }
    super.show();
  }

  protected override handleHover(): void {
    return;
  }

  protected override setTriggerItemPosition(
    nestedPopoverEl: HTMLElement,
    item: PopoverItemDefault,
  ): void {
    const itemEl = item.getElement();
    const itemOffsetLeft = itemEl ? itemEl.offsetLeft : 0;
    const totalLeftOffset = this.offsetLeft + itemOffsetLeft;

    nestedPopoverEl.style.setProperty(
      CSSVariables.TriggerItemLeft,
      totalLeftOffset + 'px',
    );
  }

  protected override showNestedItems(
    item: PopoverItemDefault | PopoverItemHtml,
  ): void {
    if (this.nestedPopoverTriggerItem === item) {
      this.destroyNestedPopoverIfExists();

      this.nestedPopoverTriggerItem = null;

      return;
    }

    super.showNestedItems(item);
  }

  protected showNestedPopoverForItem(item: PopoverItem): PopoverDesktop {
    const nestedPopover = super.showNestedPopoverForItem(item);
    const nestedPopoverEl = nestedPopover.getElement();

    nestedPopoverEl.classList.add(
      css.getPopoverNestedClass(nestedPopover.nestingLevel),
    );

    return nestedPopover;
  }

  protected override handleItemClick(item: PopoverItem): void {
    if (item !== this.nestedPopoverTriggerItem) {
      this.nestedPopoverTriggerItem?.handleClick();

      super.destroyNestedPopoverIfExists();
    }

    super.handleItemClick(item);
  }
}
