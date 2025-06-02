import { DefaultListCssClasses } from '../ListRenderer';
import type { ItemChildWrapperElement, ItemElement } from '../types/Elements';

// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
export function getChildItems(
  element: ItemElement | ItemChildWrapperElement,
  firstLevelChildren: boolean = true,
): ItemElement[] {
  let itemChildWrapper: HTMLElement = element;

  if (element.classList.contains(DefaultListCssClasses.item)) {
    itemChildWrapper = element.querySelector(
      `.${DefaultListCssClasses.itemChildren}`,
    ) as HTMLElement;
  }

  if (itemChildWrapper === null) {
    return [];
  }

  if (firstLevelChildren) {
    return Array.from(
      itemChildWrapper.querySelectorAll(
        `:scope > .${DefaultListCssClasses.item}`,
      ),
    );
  } else {
    return Array.from(
      itemChildWrapper.querySelectorAll(`.${DefaultListCssClasses.item}`),
    );
  }
}
