import Module from '@/components/__module';
import type Block from '@/components/block';
import SelectionUtils from '@/components/selection';
import * as utilities from '@/components/utilities';

export default class CrossBlockSelection extends Module {
  private firstSelectedBlock: Block;

  private lastSelectedBlock: Block;

  public async prepare(): Promise<void> {
    this.listeners.on(document, 'mousedown', (event: MouseEvent) => {
      this.enableCrossBlockSelection(event);
    });
  }

  public watchSelection(event: MouseEvent): void {
    if (event.button !== utilities.mouseButtons.LEFT) {
      return;
    }

    const { BlockManager } = this.Editor;

    this.firstSelectedBlock = BlockManager.getBlock(
      event.target as HTMLElement,
    );
    this.lastSelectedBlock = this.firstSelectedBlock;

    this.listeners.on(document, 'mouseover', this.onMouseOver);
    this.listeners.on(document, 'mouseup', this.onMouseUp);
  }

  public get isCrossBlockSelectionStarted(): boolean {
    return (
      !!this.firstSelectedBlock &&
      !!this.lastSelectedBlock &&
      this.firstSelectedBlock !== this.lastSelectedBlock
    );
  }

  public toggleBlockSelectedState(next = true): void {
    const { BlockManager, BlockSelection } = this.Editor;

    if (!this.lastSelectedBlock) {
      this.lastSelectedBlock = this.firstSelectedBlock =
        BlockManager.currentBlock;
    }

    if (this.firstSelectedBlock === this.lastSelectedBlock) {
      this.firstSelectedBlock.selected = true;

      BlockSelection.clearCache();
      SelectionUtils.get().removeAllRanges();
    }

    const nextBlockIndex =
      BlockManager.blocks.indexOf(this.lastSelectedBlock) + (next ? 1 : -1);
    const nextBlock = BlockManager.blocks[nextBlockIndex];

    if (!nextBlock) {
      return;
    }

    if (this.lastSelectedBlock.selected !== nextBlock.selected) {
      nextBlock.selected = true;

      BlockSelection.clearCache();
    } else {
      this.lastSelectedBlock.selected = false;

      BlockSelection.clearCache();
    }

    this.lastSelectedBlock = nextBlock;

    this.Editor.InlineToolbar.close();

    nextBlock.holder.scrollIntoView({
      block: 'nearest',
    });
  }

  public clear(reason?: Event): void {
    const { BlockManager, BlockSelection, Caret } = this.Editor;
    const fIndex = BlockManager.blocks.indexOf(this.firstSelectedBlock);
    const lIndex = BlockManager.blocks.indexOf(this.lastSelectedBlock);

    if (BlockSelection.anyBlockSelected && fIndex > -1 && lIndex > -1) {
      if (reason && reason instanceof KeyboardEvent) {
        switch (reason.keyCode) {
          case utilities.keyCodes.DOWN:
          case utilities.keyCodes.RIGHT:
            Caret.setToBlock(
              BlockManager.blocks[Math.max(fIndex, lIndex)],
              Caret.positions.END,
            );
            break;

          case utilities.keyCodes.UP:
          case utilities.keyCodes.LEFT:
            Caret.setToBlock(
              BlockManager.blocks[Math.min(fIndex, lIndex)],
              Caret.positions.START,
            );
            break;
          default:
            Caret.setToBlock(
              BlockManager.blocks[Math.max(fIndex, lIndex)],
              Caret.positions.END,
            );
        }
      }
    }

    this.firstSelectedBlock = this.lastSelectedBlock = null;
  }

  private enableCrossBlockSelection(event: MouseEvent): void {
    const { UI } = this.Editor;

    if (!SelectionUtils.isCollapsed) {
      this.Editor.BlockSelection.clearSelection(event);
    }

    if (UI.nodes.redactor.contains(event.target as Node)) {
      this.watchSelection(event);
    } else {
      this.Editor.BlockSelection.clearSelection(event);
    }
  }

  private onMouseUp = (): void => {
    this.listeners.off(document, 'mouseover', this.onMouseOver);
    this.listeners.off(document, 'mouseup', this.onMouseUp);
  };

  private onMouseOver = (event: MouseEvent): void => {
    const { BlockManager, BlockSelection } = this.Editor;

    if (event.relatedTarget === null && event.target === null) {
      return;
    }

    const relatedBlock =
      BlockManager.getBlockByChildNode(event.relatedTarget as Node) ||
      this.lastSelectedBlock;
    const targetBlock = BlockManager.getBlockByChildNode(event.target as Node);

    if (!relatedBlock || !targetBlock) {
      return;
    }

    if (targetBlock === relatedBlock) {
      return;
    }

    if (relatedBlock === this.firstSelectedBlock) {
      SelectionUtils.get().removeAllRanges();

      relatedBlock.selected = true;
      targetBlock.selected = true;

      BlockSelection.clearCache();

      return;
    }

    if (targetBlock === this.firstSelectedBlock) {
      relatedBlock.selected = false;
      targetBlock.selected = false;

      BlockSelection.clearCache();

      return;
    }

    this.Editor.InlineToolbar.close();

    this.toggleBlocksSelectedState(relatedBlock, targetBlock);
    this.lastSelectedBlock = targetBlock;
  };

  private toggleBlocksSelectedState(firstBlock: Block, lastBlock: Block): void {
    const { BlockManager, BlockSelection } = this.Editor;
    const fIndex = BlockManager.blocks.indexOf(firstBlock);
    const lIndex = BlockManager.blocks.indexOf(lastBlock);

    const shouldntSelectFirstBlock = firstBlock.selected !== lastBlock.selected;

    for (let i = Math.min(fIndex, lIndex); i <= Math.max(fIndex, lIndex); i++) {
      const block = BlockManager.blocks[i];

      if (
        block !== this.firstSelectedBlock &&
        block !== (shouldntSelectFirstBlock ? firstBlock : lastBlock)
      ) {
        BlockManager.blocks[i].selected = !BlockManager.blocks[i].selected;

        BlockSelection.clearCache();
      }
    }
  }
}
