import type { OrderedListItemMeta } from '../types/ItemMeta';
import type { ListConfig } from '../types/ListParams';
import { isEmpty, make } from '@editorjs/dom';
import { DefaultListCssClasses } from './ListRenderer';
import type { ListCssClasses, ListRendererInterface } from './ListRenderer';
import { CssPrefix } from '../styles/CssPrefix';

interface OrderedListCssClasses extends ListCssClasses {
  orderedList: string;
}

export class OrderedListRenderer
  implements ListRendererInterface<OrderedListItemMeta>
{
  protected config?: ListConfig;

  private readOnly: boolean;

  private static get CSS(): OrderedListCssClasses {
    return {
      ...DefaultListCssClasses,
      orderedList: `${CssPrefix}-ordered`,
    };
  }

  constructor(readonly: boolean, config?: ListConfig) {
    this.config = config;
    this.readOnly = readonly;
  }

  public renderWrapper(isRoot: boolean): HTMLOListElement {
    let wrapperElement: HTMLOListElement;

    if (isRoot === true) {
      wrapperElement = make('ol', [
        OrderedListRenderer.CSS.wrapper,
        OrderedListRenderer.CSS.orderedList,
      ]) as HTMLOListElement;
    } else {
      wrapperElement = make('ol', [
        OrderedListRenderer.CSS.orderedList,
        OrderedListRenderer.CSS.itemChildren,
      ]) as HTMLOListElement;
    }

    return wrapperElement;
  }

  public renderItem(
    content: string,
    _meta: OrderedListItemMeta,
  ): HTMLLIElement {
    const itemWrapper = make('li', OrderedListRenderer.CSS.item);
    const itemContent = make('div', OrderedListRenderer.CSS.itemContent, {
      innerHTML: content,
      contentEditable: (!this.readOnly).toString(),
    });

    itemWrapper.appendChild(itemContent);

    return itemWrapper as HTMLLIElement;
  }

  public getItemContent(item: Element): string {
    const contentNode = item.querySelector(
      `.${OrderedListRenderer.CSS.itemContent}`,
    );

    if (!contentNode) {
      return '';
    }

    if (isEmpty(contentNode)) {
      return '';
    }

    return contentNode.innerHTML;
  }

  public getItemMeta(): OrderedListItemMeta {
    return {};
  }

  public composeDefaultMeta(): OrderedListItemMeta {
    return {};
  }
}
