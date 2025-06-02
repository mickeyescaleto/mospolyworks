import type { OlCounterType } from './OlCounterType';

export interface ItemMetaBase {}

export interface OrderedListItemMeta extends ItemMetaBase {
  start?: number;
  counterType?: OlCounterType;
}

export interface UnorderedListItemMeta extends ItemMetaBase {}

export type ItemMeta = OrderedListItemMeta | UnorderedListItemMeta;
