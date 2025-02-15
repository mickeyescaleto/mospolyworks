import { IconSearch } from '@codexteam/icons';
import Dom from '@/components/dom';
import Listeners from '@/components/utils/listeners';
import type {
  SearchInputEventMap,
  SearchableItem,
} from '@/components/utils/popover/components/search-input/search-input.types';
import { SearchInputEvent } from '@/components/utils/popover/components/search-input/search-input.types';
import { css } from '@/components/utils/popover/components/search-input/search-input.const';
import EventsDispatcher from '@/components/utils/events';

export class SearchInput extends EventsDispatcher<SearchInputEventMap> {
  private wrapper: HTMLElement;

  private input: HTMLInputElement;

  private listeners: Listeners;

  private items: SearchableItem[];

  private searchQuery: string | undefined;

  constructor({
    items,
    placeholder,
  }: {
    items: SearchableItem[];
    placeholder?: string;
  }) {
    super();

    this.listeners = new Listeners();
    this.items = items;

    this.wrapper = Dom.make('div', css.wrapper);

    const iconWrapper = Dom.make('div', css.icon, {
      innerHTML: IconSearch,
    });

    this.input = Dom.make('input', css.input, {
      placeholder,
      tabIndex: -1,
    }) as HTMLInputElement;

    this.wrapper.appendChild(iconWrapper);
    this.wrapper.appendChild(this.input);

    this.listeners.on(this.input, 'input', () => {
      this.searchQuery = this.input.value;

      this.emit(SearchInputEvent.Search, {
        query: this.searchQuery,
        items: this.foundItems,
      });
    });
  }

  public getElement(): HTMLElement {
    return this.wrapper;
  }

  public focus(): void {
    this.input.focus();
  }

  public clear(): void {
    this.input.value = '';
    this.searchQuery = '';

    this.emit(SearchInputEvent.Search, {
      query: '',
      items: this.foundItems,
    });
  }

  public destroy(): void {
    this.listeners.removeAll();
  }

  private get foundItems(): SearchableItem[] {
    return this.items.filter((item) => this.checkItem(item));
  }

  private checkItem(item: SearchableItem): boolean {
    const text = item.title?.toLowerCase() || '';
    const query = this.searchQuery?.toLowerCase();

    return query !== undefined ? text.includes(query) : false;
  }
}
