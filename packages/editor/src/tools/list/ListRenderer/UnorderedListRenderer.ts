import type { UnorderedListItemMeta } from '../types/ItemMeta';
import type { ListConfig } from '../types/ListParams';
import { make, isEmpty } from '@editorjs/dom';
import { DefaultListCssClasses } from './ListRenderer';
import type { ListCssClasses, ListRendererInterface } from './ListRenderer';
import { CssPrefix } from '../styles/CssPrefix';

interface UnoderedListCssClasses extends ListCssClasses {
  unorderedList: string;
}

export class UnorderedListRenderer
  implements ListRendererInterface<UnorderedListItemMeta>
{
  protected config?: ListConfig;

  private readOnly: boolean;

  private static get CSS(): UnoderedListCssClasses {
    return {
      ...DefaultListCssClasses,
      unorderedList: `${CssPrefix}-unordered`,
    };
  }

  constructor(readonly: boolean, config?: ListConfig) {
    this.config = config;
    this.readOnly = readonly;
  }

  public renderWrapper(isRoot: boolean): HTMLUListElement {
    let wrapperElement: HTMLUListElement;

    if (isRoot === true) {
      wrapperElement = make('ul', [
        UnorderedListRenderer.CSS.wrapper,
        UnorderedListRenderer.CSS.unorderedList,
      ]) as HTMLUListElement;
    } else {
      wrapperElement = make('ul', [
        UnorderedListRenderer.CSS.unorderedList,
        UnorderedListRenderer.CSS.itemChildren,
      ]) as HTMLUListElement;
    }

    return wrapperElement;
  }

  public renderItem(
    content: string,
    _meta: UnorderedListItemMeta,
  ): HTMLLIElement {
    const itemWrapper = make('li', UnorderedListRenderer.CSS.item);
    const itemContent = make('div', UnorderedListRenderer.CSS.itemContent, {
      innerHTML: content,
      contentEditable: (!this.readOnly).toString(),
    });

    itemWrapper.appendChild(itemContent);

    return itemWrapper as HTMLLIElement;
  }

  public getItemContent(item: Element): string {
    const contentNode = item.querySelector(
      `.${UnorderedListRenderer.CSS.itemContent}`,
    );

    if (!contentNode) {
      return '';
    }

    if (isEmpty(contentNode)) {
      return '';
    }

    return contentNode.innerHTML;
  }

  public getItemMeta(): UnorderedListItemMeta {
    return {};
  }

  public composeDefaultMeta(): UnorderedListItemMeta {
    return {};
  }
}
