export type SearchableItem = {
  title?: string;
};

export enum SearchInputEvent {
  Search = 'search',
}

export type SearchInputEventMap = {
  [SearchInputEvent.Search]: { query: string; items: SearchableItem[] };
};
