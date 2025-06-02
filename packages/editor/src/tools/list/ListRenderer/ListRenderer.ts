import { CssPrefix } from '../styles/CssPrefix';

export const DefaultListCssClasses = {
  wrapper: CssPrefix,
  item: `${CssPrefix}__item`,
  itemContent: `${CssPrefix}__item-content`,
  itemChildren: `${CssPrefix}__item-children`,
};

export interface ListCssClasses {
  wrapper: string;

  item: string;

  itemContent: string;

  itemChildren: string;
}

export interface ListRendererInterface<ItemMeta> {
  renderWrapper: (isRoot: boolean) => HTMLElement;

  renderItem: (content: string, meta: ItemMeta) => HTMLElement;

  getItemContent: (item: Element) => string;

  getItemMeta: (item: Element) => ItemMeta;

  composeDefaultMeta: () => ItemMeta;
}
