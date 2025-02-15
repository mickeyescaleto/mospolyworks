import Module from '@/components/__module';
import { resolveBlock } from '@/components/utils/api';

import type { BlockAPI } from '@/types/api/block';
import type { Caret } from '@/types/api/caret';

export default class CaretAPI extends Module {
  public get methods(): Caret {
    return {
      setToFirstBlock: this.setToFirstBlock,
      setToLastBlock: this.setToLastBlock,
      setToPreviousBlock: this.setToPreviousBlock,
      setToNextBlock: this.setToNextBlock,
      setToBlock: this.setToBlock,
      focus: this.focus,
    };
  }

  private setToFirstBlock = (
    position: string = this.Editor.Caret.positions.DEFAULT,
    offset = 0,
  ): boolean => {
    if (!this.Editor.BlockManager.firstBlock) {
      return false;
    }

    this.Editor.Caret.setToBlock(
      this.Editor.BlockManager.firstBlock,
      position,
      offset,
    );

    return true;
  };

  private setToLastBlock = (
    position: string = this.Editor.Caret.positions.DEFAULT,
    offset = 0,
  ): boolean => {
    if (!this.Editor.BlockManager.lastBlock) {
      return false;
    }

    this.Editor.Caret.setToBlock(
      this.Editor.BlockManager.lastBlock,
      position,
      offset,
    );

    return true;
  };

  private setToPreviousBlock = (
    position: string = this.Editor.Caret.positions.DEFAULT,
    offset = 0,
  ): boolean => {
    if (!this.Editor.BlockManager.previousBlock) {
      return false;
    }

    this.Editor.Caret.setToBlock(
      this.Editor.BlockManager.previousBlock,
      position,
      offset,
    );

    return true;
  };

  private setToNextBlock = (
    position: string = this.Editor.Caret.positions.DEFAULT,
    offset = 0,
  ): boolean => {
    if (!this.Editor.BlockManager.nextBlock) {
      return false;
    }

    this.Editor.Caret.setToBlock(
      this.Editor.BlockManager.nextBlock,
      position,
      offset,
    );

    return true;
  };

  private setToBlock = (
    blockOrIdOrIndex: BlockAPI | BlockAPI['id'] | number,
    position: string = this.Editor.Caret.positions.DEFAULT,
    offset = 0,
  ): boolean => {
    const block = resolveBlock(blockOrIdOrIndex, this.Editor);

    if (block === undefined) {
      return false;
    }

    this.Editor.Caret.setToBlock(block, position, offset);

    return true;
  };

  private focus = (atEnd = false): boolean => {
    if (atEnd) {
      return this.setToLastBlock(this.Editor.Caret.positions.END);
    }

    return this.setToFirstBlock(this.Editor.Caret.positions.START);
  };
}
