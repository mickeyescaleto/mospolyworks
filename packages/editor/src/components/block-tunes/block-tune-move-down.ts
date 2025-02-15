import { IconChevronDown } from '@codexteam/icons';

import type { MenuConfig } from '@/types/tools/menu-config';
import type { API } from '@/types';
import type { BlockTune } from '@/types/block-tunes/block-tune';

export default class MoveDownTune implements BlockTune {
  public static readonly isTune = true;

  private readonly api: API;

  private CSS = {
    animation: 'wobble',
  };

  constructor({ api }) {
    this.api = api;
  }

  public render(): MenuConfig {
    return {
      icon: IconChevronDown,
      title: this.api.i18n.t('Move down'),
      onActivate: (): void => this.handleClick(),
      name: 'move-down',
    };
  }

  public handleClick(): void {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
    const nextBlock = this.api.blocks.getBlockByIndex(currentBlockIndex + 1);

    if (!nextBlock) {
      throw new Error('Unable to move Block down since it is already the last');
    }

    const nextBlockElement = nextBlock.holder;
    const nextBlockCoords = nextBlockElement.getBoundingClientRect();

    let scrollOffset = Math.abs(
      window.innerHeight - nextBlockElement.offsetHeight,
    );

    if (nextBlockCoords.top < window.innerHeight) {
      scrollOffset = window.scrollY + nextBlockElement.offsetHeight;
    }

    window.scrollTo(0, scrollOffset);

    this.api.blocks.move(currentBlockIndex + 1);

    this.api.toolbar.toggleBlockSettings(true);
  }
}
