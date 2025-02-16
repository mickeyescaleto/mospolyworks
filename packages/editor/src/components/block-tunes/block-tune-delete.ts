import { IconCross } from '@codexteam/icons';

import type { MenuConfig } from '@repo/editor/types/tools/menu-config';
import type { API } from '@repo/editor/types';
import type { BlockTune } from '@repo/editor/types/block-tunes/block-tune';

export default class DeleteTune implements BlockTune {
  public static readonly isTune = true;

  private readonly api: API;

  constructor({ api }) {
    this.api = api;
  }

  public render(): MenuConfig {
    return {
      icon: IconCross,
      title: this.api.i18n.t('Delete'),
      name: 'delete',
      confirmation: {
        title: this.api.i18n.t('Click to delete'),
        onActivate: (): void => this.handleClick(),
      },
    };
  }

  public handleClick(): void {
    this.api.blocks.delete();
  }
}
