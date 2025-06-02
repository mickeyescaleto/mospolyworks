import { DefaultListCssClasses } from '../ListRenderer';
import type { ItemChildWrapperElement, ItemElement } from '../types/Elements';
import { getChildItems } from './getChildItems';
import { getItemChildWrapper } from './getItemChildWrapper';

// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
export function removeChildWrapperIfEmpty(
  element: ItemChildWrapperElement | ItemElement,
): void {
  let itemChildWrapper: HTMLElement | null = element;

  if (element.classList.contains(DefaultListCssClasses.item)) {
    itemChildWrapper = getItemChildWrapper(element);
  }

  if (itemChildWrapper === null) {
    return;
  }

  if (getChildItems(itemChildWrapper).length === 0) {
    itemChildWrapper.remove();
  }
}
