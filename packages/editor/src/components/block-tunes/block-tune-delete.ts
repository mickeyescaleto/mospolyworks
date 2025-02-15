import { IconCross } from '@codexteam/icons';

import type { MenuConfig } from '@/types/tools/menu-config';
import type { API } from '@/types';
import type { BlockTune } from '@/types/block-tunes/block-tune';

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
