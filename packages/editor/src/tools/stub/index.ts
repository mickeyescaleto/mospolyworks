import { IconWarning } from '@codexteam/icons';
import Dom from '@repo/editor/components/dom';

import type {
  BlockTool,
  BlockToolConstructorOptions,
} from '@repo/editor/types/tools/block-tool';
import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';
import type { API } from '@repo/editor/types';

export type StubData = BlockToolData & {
  title: string;
  savedData: BlockToolData;
};

export default class Stub implements BlockTool {
  public static isReadOnlySupported = true;

  private CSS = {
    wrapper: 'ce-stub',
    info: 'ce-stub__info',
    title: 'ce-stub__title',
    subtitle: 'ce-stub__subtitle',
  };

  private readonly wrapper: HTMLElement;

  private readonly api: API;

  private readonly title: string;

  private readonly subtitle: string;

  private readonly savedData: BlockToolData;

  constructor({ data, api }: BlockToolConstructorOptions<StubData>) {
    this.api = api;
    this.title = data.title || this.api.i18n.t('Error');
    this.subtitle = this.api.i18n.t('The block can not be displayed correctly');
    this.savedData = data.savedData;

    this.wrapper = this.make();
  }

  public render(): HTMLElement {
    return this.wrapper;
  }

  public save(): BlockToolData {
    return this.savedData;
  }

  private make(): HTMLElement {
    const wrapper = Dom.make('div', this.CSS.wrapper);
    const icon = IconWarning;
    const infoContainer = Dom.make('div', this.CSS.info);
    const title = Dom.make('div', this.CSS.title, {
      textContent: this.title,
    });
    const subtitle = Dom.make('div', this.CSS.subtitle, {
      textContent: this.subtitle,
    });

    wrapper.innerHTML = icon;

    infoContainer.appendChild(title);
    infoContainer.appendChild(subtitle);

    wrapper.appendChild(infoContainer);

    return wrapper;
  }
}
