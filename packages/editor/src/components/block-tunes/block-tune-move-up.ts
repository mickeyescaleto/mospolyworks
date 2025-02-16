import { IconChevronUp } from '@codexteam/icons';

import type { MenuConfig } from '@repo/editor/types/tools/menu-config';
import type { API } from '@repo/editor/types';
import type { BlockTune } from '@repo/editor/types/block-tunes/block-tune';

export default class MoveUpTune implements BlockTune {
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
      icon: IconChevronUp,
      title: this.api.i18n.t('Move up'),
      onActivate: (): void => this.handleClick(),
      name: 'move-up',
    };
  }

  public handleClick(): void {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
    const currentBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);
    const previousBlock = this.api.blocks.getBlockByIndex(
      currentBlockIndex - 1,
    );

    if (currentBlockIndex === 0 || !currentBlock || !previousBlock) {
      throw new Error('Unable to move Block up since it is already the first');
    }

    const currentBlockElement = currentBlock.holder;
    const previousBlockElement = previousBlock.holder;

    const currentBlockCoords = currentBlockElement.getBoundingClientRect(),
      previousBlockCoords = previousBlockElement.getBoundingClientRect();

    let scrollUpOffset;

    if (previousBlockCoords.top > 0) {
      scrollUpOffset =
        Math.abs(currentBlockCoords.top) - Math.abs(previousBlockCoords.top);
    } else {
      scrollUpOffset =
        Math.abs(currentBlockCoords.top) + previousBlockCoords.height;
    }

    window.scrollBy(0, -1 * scrollUpOffset);

    this.api.blocks.move(currentBlockIndex - 1);

    this.api.toolbar.toggleBlockSettings(true);
  }
}
