import { IconListBulleted, IconListNumbered } from '@codexteam/icons';
import { IconStartWith } from './styles/icons/index.js';
import type {
  ListConfig,
  ListData,
  ListDataStyle,
  ListItem,
  OldListData,
} from './types/ListParams';
import ListTabulator from './ListTabulator';
import { OrderedListRenderer, UnorderedListRenderer } from './ListRenderer';
import type { ListRenderer } from './types/ListRenderer';
import { renderToolboxInput } from './utils/renderToolboxInput';
import {
  OlCounterIconsMap,
  type OlCounterType,
  OlCounterTypesMap,
} from './types/OlCounterType';

import './styles/list.css';
import './styles/input.css';
import stripNumbers from './utils/stripNumbers';
import normalizeData from './utils/normalizeData';
import type { PasteEvent } from './types';
import type { OrderedListItemMeta } from './types/ItemMeta';
import { BlockToolConstructorOptions } from '@repo/editor/types/tools/block-tool.js';
import { ToolboxConfig } from '@repo/editor/types/tools/tool-settings.js';
import { PasteConfig } from '@repo/editor/types/configs/paste-config.js';
import { ToolConfig } from '@repo/editor/types/tools/tool-config.js';
import { API } from '@repo/editor/types';
import { BlockAPI } from '@repo/editor/types/api/block.js';
import { MenuConfigItem } from '@repo/editor/types/tools/menu-config.js';

export type ListParams = BlockToolConstructorOptions<
  ListData | OldListData,
  ListConfig
>;

export default class List {
  public static get isReadOnlySupported(): boolean {
    return true;
  }

  public static get enableLineBreaks(): boolean {
    return true;
  }

  public static get toolbox(): ToolboxConfig {
    return [
      {
        icon: IconListBulleted,
        title: 'Unordered List',
        data: {
          style: 'unordered',
        },
      },
      {
        icon: IconListNumbered,
        title: 'Ordered List',
        data: {
          style: 'ordered',
        },
      },
    ];
  }

  public static get pasteConfig(): PasteConfig {
    return {
      tags: ['OL', 'UL', 'LI'],
    };
  }

  public static get conversionConfig(): {
    export: (data: ListData) => string;
    import: (content: string, config: ToolConfig<ListConfig>) => ListData;
  } {
    return {
      export: (data) => {
        return List.joinRecursive(data);
      },
      import: (content, config) => {
        return {
          meta: {},
          items: [
            {
              content,
              meta: {},
              items: [],
            },
          ],
          style:
            config?.defaultStyle !== undefined
              ? config.defaultStyle
              : 'unordered',
        };
      },
    };
  }

  private get listStyle(): ListDataStyle {
    return this.data.style || this.defaultListStyle;
  }

  private set listStyle(style: ListDataStyle) {
    this.data.style = style;

    this.changeTabulatorByStyle();

    const newListElement = this.list!.render();

    this.listElement?.replaceWith(newListElement);

    this.listElement = newListElement;
  }

  private api: API;

  private readOnly: boolean;

  private config: ListConfig | undefined;

  private defaultListStyle?: ListConfig['defaultStyle'];

  private defaultCounterTypes: OlCounterType[];

  private data: ListData;

  private block: BlockAPI;

  private list: ListTabulator<ListRenderer> | undefined;

  private listElement: HTMLElement | undefined;

  constructor({ data, config, api, readOnly, block }: ListParams) {
    this.api = api;
    this.readOnly = readOnly;
    this.config = config;
    this.block = block;

    this.defaultListStyle = this.config?.defaultStyle || 'unordered';

    this.defaultCounterTypes =
      (this.config as ListConfig).counterTypes ||
      (Array.from(OlCounterTypesMap.values()) as OlCounterType[]);

    const initialData = {
      style: this.defaultListStyle,
      meta: {},
      items: [],
    };

    this.data = Object.keys(data).length ? normalizeData(data) : initialData;

    if (
      this.listStyle === 'ordered' &&
      (this.data.meta as OrderedListItemMeta).counterType === undefined
    ) {
      (this.data.meta as OrderedListItemMeta).counterType = 'numeric';
    }

    this.changeTabulatorByStyle();
  }

  private static joinRecursive(data: ListData | ListItem): string {
    return data.items
      .map((item) => `${item.content} ${List.joinRecursive(item)}`)
      .join('');
  }

  public render(): HTMLElement {
    this.listElement = this.list!.render();

    return this.listElement;
  }

  public save(): ListData {
    this.data = this.list!.save();

    return this.data;
  }

  public merge(data: ListData): void {
    this.list!.merge(data);
  }

  public renderSettings(): MenuConfigItem[] {
    const defaultTunes: MenuConfigItem[] = [
      {
        label: this.api.i18n.t('Unordered'),
        icon: IconListBulleted,
        closeOnActivate: true,
        isActive: this.listStyle == 'unordered',
        onActivate: () => {
          this.listStyle = 'unordered';
        },
      },
      {
        label: this.api.i18n.t('Ordered'),
        icon: IconListNumbered,
        closeOnActivate: true,
        isActive: this.listStyle == 'ordered',
        onActivate: () => {
          this.listStyle = 'ordered';
        },
      },
    ];

    if (this.listStyle === 'ordered') {
      const startWithElement = renderToolboxInput(
        (index: string) => this.changeStartWith(Number(index)),
        {
          value: String((this.data.meta as OrderedListItemMeta).start ?? 1),
          placeholder: '',
          attributes: {
            required: 'true',
          },
          sanitize: (input) => stripNumbers(input),
        },
      );

      const orderedListTunes: MenuConfigItem[] = [
        {
          label: this.api.i18n.t('Start with'),
          icon: IconStartWith,
          children: {
            items: [
              {
                element: startWithElement,
                // @ts-expect-error ts(2820) can not use PopoverItem enum from editor.js types
                type: 'html',
              },
            ],
          },
        },
      ];

      const orderedListCountersTunes: MenuConfigItem = {
        label: this.api.i18n.t('Counter type'),
        icon: OlCounterIconsMap.get(
          (this.data.meta as OrderedListItemMeta).counterType!,
        ),
        children: {
          items: [],
        },
      };

      OlCounterTypesMap.forEach((_, counterType: string) => {
        const counterTypeValue = OlCounterTypesMap.get(
          counterType,
        )! as OlCounterType;

        if (!this.defaultCounterTypes.includes(counterTypeValue)) {
          return;
        }

        orderedListCountersTunes.children.items!.push({
          title: this.api.i18n.t(counterType),
          icon: OlCounterIconsMap.get(counterTypeValue),
          isActive:
            (this.data.meta as OrderedListItemMeta).counterType ===
            OlCounterTypesMap.get(counterType),
          closeOnActivate: true,
          onActivate: () => {
            this.changeCounters(
              OlCounterTypesMap.get(counterType) as OlCounterType,
            );
          },
        });
      });

      if (orderedListCountersTunes.children.items!.length > 1) {
        orderedListTunes.push(orderedListCountersTunes);
      }

      // @ts-expect-error ts(2820) can not use PopoverItem enum from editor.js types
      defaultTunes.push({ type: 'separator' }, ...orderedListTunes);
    }

    return defaultTunes;
  }

  public onPaste(event: PasteEvent): void {
    const { tagName: tag } = event.detail.data;

    switch (tag) {
      case 'OL':
        this.listStyle = 'ordered';
        break;
      case 'UL':
      case 'LI':
        this.listStyle = 'unordered';
    }

    this.list!.onPaste(event);
  }

  public pasteHandler(element: PasteEvent['detail']['data']): ListData {
    const data = this.list!.pasteHandler(element);

    return data;
  }

  private changeCounters(counterType: OlCounterType): void {
    this.list?.changeCounters(counterType);

    (this.data.meta as OrderedListItemMeta).counterType = counterType;
  }

  private changeStartWith(index: number): void {
    this.list?.changeStartWith(index);

    (this.data.meta as OrderedListItemMeta).start = index;
  }

  private changeTabulatorByStyle(): void {
    switch (this.listStyle) {
      case 'ordered':
        this.list = new ListTabulator<OrderedListRenderer>(
          {
            data: this.data,
            readOnly: this.readOnly,
            api: this.api,
            config: this.config,
            block: this.block,
          },
          new OrderedListRenderer(this.readOnly, this.config),
        );

        break;

      case 'unordered':
        this.list = new ListTabulator<UnorderedListRenderer>(
          {
            data: this.data,
            readOnly: this.readOnly,
            api: this.api,
            config: this.config,
            block: this.block,
          },
          new UnorderedListRenderer(this.readOnly, this.config),
        );

        break;
    }
  }
}
