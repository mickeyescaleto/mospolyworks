import Module from '@repo/editor/components/__module';
import Block from '@repo/editor/components/block';
import * as utilities from '@repo/editor/components/utilities';
import Dom from '@repo/editor/components/dom';
import Shortcuts from '@repo/editor/components/utils/shortcuts';
import SelectionUtils from '@repo/editor/components/selection';
import { clean } from '@repo/editor/components/utils/sanitizer';

import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';

export default class BlockSelection extends Module {
  private anyBlockSelectedCache: boolean | null = null;

  private get sanitizerConfig(): SanitizerConfig {
    return {
      p: {},
      h1: {},
      h2: {},
      h3: {},
      h4: {},
      h5: {},
      h6: {},
      ol: {},
      ul: {},
      li: {},
      br: true,
      img: {
        src: true,
        width: true,
        height: true,
      },
      a: {
        href: true,
      },
      b: {},
      i: {},
      u: {},
    };
  }

  public get allBlocksSelected(): boolean {
    const { BlockManager } = this.Editor;

    return BlockManager.blocks.every((block) => block.selected === true);
  }

  public set allBlocksSelected(state: boolean) {
    const { BlockManager } = this.Editor;

    BlockManager.blocks.forEach((block) => {
      block.selected = state;
    });

    this.clearCache();
  }

  public get anyBlockSelected(): boolean {
    const { BlockManager } = this.Editor;

    if (this.anyBlockSelectedCache === null) {
      this.anyBlockSelectedCache = BlockManager.blocks.some(
        (block) => block.selected === true,
      );
    }

    return this.anyBlockSelectedCache;
  }

  public get selectedBlocks(): Block[] {
    return this.Editor.BlockManager.blocks.filter(
      (block: Block) => block.selected,
    );
  }

  private needToSelectAll = false;

  private nativeInputSelected = false;

  private readyToBlockSelection = false;

  private selection: SelectionUtils;

  public prepare(): void {
    this.selection = new SelectionUtils();

    Shortcuts.add({
      name: 'CMD+A',
      handler: (event) => {
        const { BlockManager, ReadOnly } = this.Editor;

        if (ReadOnly.isEnabled) {
          event.preventDefault();
          this.selectAllBlocks();

          return;
        }

        if (!BlockManager.currentBlock) {
          return;
        }

        this.handleCommandA(event);
      },
      on: this.Editor.UI.nodes.redactor,
    });
  }

  public toggleReadOnly(): void {
    SelectionUtils.get().removeAllRanges();

    this.allBlocksSelected = false;
  }

  public unSelectBlockByIndex(index?): void {
    const { BlockManager } = this.Editor;

    let block;

    if (isNaN(index)) {
      block = BlockManager.currentBlock;
    } else {
      block = BlockManager.getBlockByIndex(index);
    }

    block.selected = false;

    this.clearCache();
  }

  public clearSelection(reason?: Event, restoreSelection = false): void {
    const { BlockManager, Caret, RectangleSelection } = this.Editor;

    this.needToSelectAll = false;
    this.nativeInputSelected = false;
    this.readyToBlockSelection = false;

    const isKeyboard = reason && reason instanceof KeyboardEvent;
    const isPrintableKey =
      isKeyboard && utilities.isPrintableKey((reason as KeyboardEvent).keyCode);

    if (
      this.anyBlockSelected &&
      isKeyboard &&
      isPrintableKey &&
      !SelectionUtils.isSelectionExists
    ) {
      const indexToInsert = BlockManager.removeSelectedBlocks();

      BlockManager.insertDefaultBlockAtIndex(indexToInsert, true);
      Caret.setToBlock(BlockManager.currentBlock);
      utilities.delay(() => {
        const eventKey = (reason as KeyboardEvent).key;

        Caret.insertContentAtCaretPosition(eventKey.length > 1 ? '' : eventKey);
      }, 20)();
    }

    this.Editor.CrossBlockSelection.clear(reason);

    if (!this.anyBlockSelected || RectangleSelection.isRectActivated()) {
      this.Editor.RectangleSelection.clearSelection();

      return;
    }

    if (restoreSelection) {
      this.selection.restore();
    }

    this.allBlocksSelected = false;
  }

  public copySelectedBlocks(e: ClipboardEvent): Promise<void> {
    e.preventDefault();

    const fakeClipboard = Dom.make('div');

    this.selectedBlocks.forEach((block) => {
      const cleanHTML = clean(block.holder.innerHTML, this.sanitizerConfig);

      const fragment = Dom.make('p');

      fragment.innerHTML = cleanHTML;
      fakeClipboard.appendChild(fragment);
    });

    const textPlain = Array.from(fakeClipboard.childNodes)
      .map((node) => node.textContent)
      .join('\n\n');
    const textHTML = fakeClipboard.innerHTML;

    e.clipboardData.setData('text/plain', textPlain);
    e.clipboardData.setData('text/html', textHTML);

    return Promise.all(this.selectedBlocks.map((block) => block.save())).then(
      (savedData) => {
        try {
          e.clipboardData.setData(
            this.Editor.Paste.MIME_TYPE,
            JSON.stringify(savedData),
          );
        } catch (error) {}
      },
    );
  }

  public selectBlockByIndex(index: number): void {
    const { BlockManager } = this.Editor;

    const block = BlockManager.getBlockByIndex(index);

    if (block === undefined) {
      return;
    }

    this.selectBlock(block);
  }

  public selectBlock(block: Block): void {
    this.selection.save();
    SelectionUtils.get().removeAllRanges();

    block.selected = true;

    this.clearCache();

    this.Editor.InlineToolbar.close();
  }

  public unselectBlock(block: Block): void {
    block.selected = false;

    this.clearCache();
  }

  public clearCache(): void {
    this.anyBlockSelectedCache = null;
  }

  public destroy(): void {
    Shortcuts.remove(this.Editor.UI.nodes.redactor, 'CMD+A');
  }

  private handleCommandA(event: KeyboardEvent): void {
    this.Editor.RectangleSelection.clearSelection();

    if (Dom.isNativeInput(event.target) && !this.readyToBlockSelection) {
      this.readyToBlockSelection = true;

      return;
    }

    const workingBlock = this.Editor.BlockManager.getBlock(
      event.target as HTMLElement,
    );
    const inputs = workingBlock.inputs;

    if (inputs.length > 1 && !this.readyToBlockSelection) {
      this.readyToBlockSelection = true;

      return;
    }

    if (inputs.length === 1 && !this.needToSelectAll) {
      this.needToSelectAll = true;

      return;
    }

    if (this.needToSelectAll) {
      event.preventDefault();

      this.selectAllBlocks();

      this.needToSelectAll = false;
      this.readyToBlockSelection = false;
    } else if (this.readyToBlockSelection) {
      event.preventDefault();

      this.selectBlock(workingBlock);

      this.needToSelectAll = true;
    }
  }

  private selectAllBlocks(): void {
    this.selection.save();

    SelectionUtils.get().removeAllRanges();

    this.allBlocksSelected = true;

    this.Editor.InlineToolbar.close();
  }
}
