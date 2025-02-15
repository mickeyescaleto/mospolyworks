import Module from '@/components/__module';
import * as utilities from '@/components/utilities';
import SelectionUtils from '@/components/selection';
import Flipper from '@/components/flipper';
import Block from '@/components/block';
import { areBlocksMergeable } from '@/components/utils/blocks';
import * as caretUtils from '@/components/utils/caret';
import { focus } from '@editorjs/caret';

export default class BlockEvents extends Module {
  public keydown(event: KeyboardEvent): void {
    this.beforeKeydownProcessing(event);

    switch (event.keyCode) {
      case utilities.keyCodes.BACKSPACE:
        this.backspace(event);
        break;

      case utilities.keyCodes.DELETE:
        this.delete(event);
        break;

      case utilities.keyCodes.ENTER:
        this.enter(event);
        break;

      case utilities.keyCodes.DOWN:
      case utilities.keyCodes.RIGHT:
        this.arrowRightAndDown(event);
        break;

      case utilities.keyCodes.UP:
      case utilities.keyCodes.LEFT:
        this.arrowLeftAndUp(event);
        break;

      case utilities.keyCodes.TAB:
        this.tabPressed(event);
        break;
    }

    if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
      this.slashPressed(event);
    }

    if (event.code === 'Slash' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.commandSlashPressed();
    }
  }

  public beforeKeydownProcessing(event: KeyboardEvent): void {
    if (!this.needToolbarClosing(event)) {
      return;
    }

    if (utilities.isPrintableKey(event.keyCode)) {
      this.Editor.Toolbar.close();

      const isShortcut =
        event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

      if (!isShortcut) {
        this.Editor.BlockSelection.clearSelection(event);
      }
    }
  }

  public keyup(event: KeyboardEvent): void {
    if (event.shiftKey) {
      return;
    }

    this.Editor.UI.checkEmptiness();
  }

  public dragOver(event: DragEvent): void {
    const block = this.Editor.BlockManager.getBlockByChildNode(
      event.target as Node,
    );

    block.dropTarget = true;
  }

  public dragLeave(event: DragEvent): void {
    const block = this.Editor.BlockManager.getBlockByChildNode(
      event.target as Node,
    );

    block.dropTarget = false;
  }

  public handleCommandC(event: ClipboardEvent): void {
    const { BlockSelection } = this.Editor;

    if (!BlockSelection.anyBlockSelected) {
      return;
    }

    BlockSelection.copySelectedBlocks(event);
  }

  public handleCommandX(event: ClipboardEvent): void {
    const { BlockSelection, BlockManager, Caret } = this.Editor;

    if (!BlockSelection.anyBlockSelected) {
      return;
    }

    BlockSelection.copySelectedBlocks(event).then(() => {
      const selectionPositionIndex = BlockManager.removeSelectedBlocks();

      const insertedBlock = BlockManager.insertDefaultBlockAtIndex(
        selectionPositionIndex,
        true,
      );

      Caret.setToBlock(insertedBlock, Caret.positions.START);

      BlockSelection.clearSelection(event);
    });
  }

  private tabPressed(event: KeyboardEvent): void {
    const { InlineToolbar, Caret } = this.Editor;

    const isFlipperActivated = InlineToolbar.opened;

    if (isFlipperActivated) {
      return;
    }

    const isNavigated = event.shiftKey
      ? Caret.navigatePrevious(true)
      : Caret.navigateNext(true);

    if (isNavigated) {
      event.preventDefault();
    }
  }

  private commandSlashPressed(): void {
    if (this.Editor.BlockSelection.selectedBlocks.length > 1) {
      return;
    }

    this.activateBlockSettings();
  }

  private slashPressed(event: KeyboardEvent): void {
    const wasEventTriggeredInsideEditor = this.Editor.UI.nodes.wrapper.contains(
      event.target as Node,
    );

    if (!wasEventTriggeredInsideEditor) {
      return;
    }

    const currentBlock = this.Editor.BlockManager.currentBlock;
    const canOpenToolbox = currentBlock.isEmpty;

    if (!canOpenToolbox) {
      return;
    }

    event.preventDefault();
    this.Editor.Caret.insertContentAtCaretPosition('/');

    this.activateToolbox();
  }

  private enter(event: KeyboardEvent): void {
    const { BlockManager, UI } = this.Editor;
    const currentBlock = BlockManager.currentBlock;

    if (currentBlock === undefined) {
      return;
    }

    if (currentBlock.tool.isLineBreaksEnabled) {
      return;
    }

    if (UI.someToolbarOpened && UI.someFlipperButtonFocused) {
      return;
    }

    if (event.shiftKey && !utilities.isIosDevice) {
      return;
    }

    let blockToFocus = currentBlock;

    if (
      currentBlock.currentInput !== undefined &&
      caretUtils.isCaretAtStartOfInput(currentBlock.currentInput) &&
      !currentBlock.hasMedia
    ) {
      this.Editor.BlockManager.insertDefaultBlockAtIndex(
        this.Editor.BlockManager.currentBlockIndex,
      );
    } else if (
      currentBlock.currentInput &&
      caretUtils.isCaretAtEndOfInput(currentBlock.currentInput)
    ) {
      blockToFocus = this.Editor.BlockManager.insertDefaultBlockAtIndex(
        this.Editor.BlockManager.currentBlockIndex + 1,
      );
    } else {
      blockToFocus = this.Editor.BlockManager.split();
    }

    this.Editor.Caret.setToBlock(blockToFocus);

    this.Editor.Toolbar.moveAndOpen(blockToFocus);

    event.preventDefault();
  }

  private backspace(event: KeyboardEvent): void {
    const { BlockManager, Caret } = this.Editor;
    const { currentBlock, previousBlock } = BlockManager;

    if (currentBlock === undefined) {
      return;
    }

    if (!SelectionUtils.isCollapsed) {
      return;
    }

    if (
      !currentBlock.currentInput ||
      !caretUtils.isCaretAtStartOfInput(currentBlock.currentInput)
    ) {
      return;
    }

    event.preventDefault();
    this.Editor.Toolbar.close();

    const isFirstInputFocused =
      currentBlock.currentInput === currentBlock.firstInput;

    if (!isFirstInputFocused) {
      Caret.navigatePrevious();

      return;
    }

    if (previousBlock === null) {
      return;
    }

    if (previousBlock.isEmpty) {
      BlockManager.removeBlock(previousBlock);

      return;
    }

    if (currentBlock.isEmpty) {
      BlockManager.removeBlock(currentBlock);

      const newCurrentBlock = BlockManager.currentBlock;

      Caret.setToBlock(newCurrentBlock, Caret.positions.END);

      return;
    }

    const bothBlocksMergeable = areBlocksMergeable(previousBlock, currentBlock);

    if (bothBlocksMergeable) {
      this.mergeBlocks(previousBlock, currentBlock);
    } else {
      Caret.setToBlock(previousBlock, Caret.positions.END);
    }
  }

  private delete(event: KeyboardEvent): void {
    const { BlockManager, Caret } = this.Editor;
    const { currentBlock, nextBlock } = BlockManager;

    if (!SelectionUtils.isCollapsed) {
      return;
    }

    if (!caretUtils.isCaretAtEndOfInput(currentBlock.currentInput)) {
      return;
    }

    event.preventDefault();
    this.Editor.Toolbar.close();

    const isLastInputFocused =
      currentBlock.currentInput === currentBlock.lastInput;

    if (!isLastInputFocused) {
      Caret.navigateNext();

      return;
    }

    if (nextBlock === null) {
      return;
    }

    if (nextBlock.isEmpty) {
      BlockManager.removeBlock(nextBlock);

      return;
    }

    if (currentBlock.isEmpty) {
      BlockManager.removeBlock(currentBlock);

      Caret.setToBlock(nextBlock, Caret.positions.START);

      return;
    }

    const bothBlocksMergeable = areBlocksMergeable(currentBlock, nextBlock);

    if (bothBlocksMergeable) {
      this.mergeBlocks(currentBlock, nextBlock);
    } else {
      Caret.setToBlock(nextBlock, Caret.positions.START);
    }
  }

  private mergeBlocks(targetBlock: Block, blockToMerge: Block): void {
    const { BlockManager, Toolbar } = this.Editor;

    if (targetBlock.lastInput === undefined) {
      return;
    }

    focus(targetBlock.lastInput, false);

    BlockManager.mergeBlocks(targetBlock, blockToMerge).then(() => {
      Toolbar.close();
    });
  }

  private arrowRightAndDown(event: KeyboardEvent): void {
    const isFlipperCombination =
      Flipper.usedKeys.includes(event.keyCode) &&
      (!event.shiftKey || event.keyCode === utilities.keyCodes.TAB);

    if (this.Editor.UI.someToolbarOpened && isFlipperCombination) {
      return;
    }

    this.Editor.Toolbar.close();

    const { currentBlock } = this.Editor.BlockManager;
    const caretAtEnd =
      currentBlock?.currentInput !== undefined
        ? caretUtils.isCaretAtEndOfInput(currentBlock.currentInput)
        : undefined;
    const shouldEnableCBS =
      caretAtEnd || this.Editor.BlockSelection.anyBlockSelected;

    if (
      event.shiftKey &&
      event.keyCode === utilities.keyCodes.DOWN &&
      shouldEnableCBS
    ) {
      this.Editor.CrossBlockSelection.toggleBlockSelectedState();

      return;
    }

    const navigateNext =
      event.keyCode === utilities.keyCodes.DOWN ||
      (event.keyCode === utilities.keyCodes.RIGHT && !this.isRtl);
    const isNavigated = navigateNext
      ? this.Editor.Caret.navigateNext()
      : this.Editor.Caret.navigatePrevious();

    if (isNavigated) {
      event.preventDefault();
      return;
    }

    utilities.delay(() => {
      if (this.Editor.BlockManager.currentBlock) {
        this.Editor.BlockManager.currentBlock.updateCurrentInput();
      }
    }, 20)();

    this.Editor.BlockSelection.clearSelection(event);
  }

  private arrowLeftAndUp(event: KeyboardEvent): void {
    if (this.Editor.UI.someToolbarOpened) {
      if (
        Flipper.usedKeys.includes(event.keyCode) &&
        (!event.shiftKey || event.keyCode === utilities.keyCodes.TAB)
      ) {
        return;
      }

      this.Editor.UI.closeAllToolbars();
    }

    this.Editor.Toolbar.close();

    const { currentBlock } = this.Editor.BlockManager;
    const caretAtStart =
      currentBlock?.currentInput !== undefined
        ? caretUtils.isCaretAtStartOfInput(currentBlock.currentInput)
        : undefined;
    const shouldEnableCBS =
      caretAtStart || this.Editor.BlockSelection.anyBlockSelected;

    if (
      event.shiftKey &&
      event.keyCode === utilities.keyCodes.UP &&
      shouldEnableCBS
    ) {
      this.Editor.CrossBlockSelection.toggleBlockSelectedState(false);

      return;
    }

    const navigatePrevious =
      event.keyCode === utilities.keyCodes.UP ||
      (event.keyCode === utilities.keyCodes.LEFT && !this.isRtl);
    const isNavigated = navigatePrevious
      ? this.Editor.Caret.navigatePrevious()
      : this.Editor.Caret.navigateNext();

    if (isNavigated) {
      event.preventDefault();
      return;
    }

    utilities.delay(() => {
      if (this.Editor.BlockManager.currentBlock) {
        this.Editor.BlockManager.currentBlock.updateCurrentInput();
      }
    }, 20)();

    this.Editor.BlockSelection.clearSelection(event);
  }

  private needToolbarClosing(event: KeyboardEvent): boolean {
    const toolboxItemSelected =
        event.keyCode === utilities.keyCodes.ENTER &&
        this.Editor.Toolbar.toolbox.opened,
      blockSettingsItemSelected =
        event.keyCode === utilities.keyCodes.ENTER &&
        this.Editor.BlockSettings.opened,
      inlineToolbarItemSelected =
        event.keyCode === utilities.keyCodes.ENTER &&
        this.Editor.InlineToolbar.opened,
      flippingToolbarItems = event.keyCode === utilities.keyCodes.TAB;

    return !(
      event.shiftKey ||
      flippingToolbarItems ||
      toolboxItemSelected ||
      blockSettingsItemSelected ||
      inlineToolbarItemSelected
    );
  }

  private activateToolbox(): void {
    if (!this.Editor.Toolbar.opened) {
      this.Editor.Toolbar.moveAndOpen();
    }

    this.Editor.Toolbar.toolbox.open();
  }

  private activateBlockSettings(): void {
    if (!this.Editor.Toolbar.opened) {
      this.Editor.Toolbar.moveAndOpen();
    }

    if (!this.Editor.BlockSettings.opened) {
      this.Editor.BlockSettings.open();
    }
  }
}
