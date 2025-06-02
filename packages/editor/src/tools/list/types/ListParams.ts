import type { ItemMeta } from './ItemMeta';
import type { OlCounterType } from './OlCounterType';

export type ListDataStyle = 'ordered' | 'unordered';

export type ListData = Omit<ListItem, 'content'> & {
  style: ListDataStyle;
};

export interface OldListData {
  style: 'ordered' | 'unordered';
  items: string[];
}

export type OldNestedListData = Omit<ListData, 'meta'>;

export interface ListItem {
  content: string;
  meta: ItemMeta;
  items: ListItem[];
}

export interface ListConfig {
  defaultStyle?: ListDataStyle;
  maxLevel?: number;
  counterTypes?: OlCounterType[];
}
