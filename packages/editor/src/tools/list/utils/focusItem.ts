import { focus } from '@editorjs/caret';
import type { ItemElement } from '../types/Elements';
import { getItemContentElement } from './getItemContentElement';

export function focusItem(item: ItemElement, atStart: boolean = true): void {
  const itemContent = getItemContentElement(item);

  if (!itemContent) {
    return;
  }

  focus(itemContent, atStart);
}
