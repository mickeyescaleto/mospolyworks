import Selection from '@repo/editor/components/selection';
import Module from '@repo/editor/components/__module';
import Block from '@repo/editor/components/block';
import * as caretUtils from '@repo/editor/components/utils/caret';
import Dom from '@repo/editor/components/dom';

export default class Caret extends Module {
  public get positions(): { START: string; END: string; DEFAULT: string } {
    return {
      START: 'start',
      END: 'end',
      DEFAULT: 'default',
    };
  }

  private static get CSS(): { shadowCaret: string } {
    return {
      shadowCaret: 'cdx-shadow-caret',
    };
  }

  public setToBlock(
    block: Block,
    position: string = this.positions.DEFAULT,
    offset = 0,
  ): void {
    const { BlockManager, BlockSelection } = this.Editor;

    BlockSelection.clearSelection();

    if (!block.focusable) {
      window.getSelection()?.removeAllRanges();

      BlockSelection.selectBlock(block);
      BlockManager.currentBlock = block;

      return;
    }

    let element;

    switch (position) {
      case this.positions.START:
        element = block.firstInput;
        break;
      case this.positions.END:
        element = block.lastInput;
        break;
      default:
        element = block.currentInput;
    }

    if (!element) {
      return;
    }

    const nodeToSet = Dom.getDeepestNode(
      element,
      position === this.positions.END,
    );
    const contentLength = Dom.getContentLength(nodeToSet);

    switch (true) {
      case position === this.positions.START:
        offset = 0;
        break;
      case position === this.positions.END:
      case offset > contentLength:
        offset = contentLength;
        break;
    }

    this.set(nodeToSet as HTMLElement, offset);

    BlockManager.setCurrentBlockByChildNode(block.holder);
    BlockManager.currentBlock.currentInput = element;
  }

  public setToInput(
    input: HTMLElement,
    position: string = this.positions.DEFAULT,
    offset = 0,
  ): void {
    const { currentBlock } = this.Editor.BlockManager;
    const nodeToSet = Dom.getDeepestNode(input);

    switch (position) {
      case this.positions.START:
        this.set(nodeToSet as HTMLElement, 0);
        break;

      case this.positions.END:
        this.set(nodeToSet as HTMLElement, Dom.getContentLength(nodeToSet));
        break;

      default:
        if (offset) {
          this.set(nodeToSet as HTMLElement, offset);
        }
    }

    currentBlock.currentInput = input;
  }

  public set(element: HTMLElement, offset = 0): void {
    const scrollOffset = 30;
    const { top, bottom } = Selection.setCursor(element, offset);
    const { innerHeight } = window;

    if (top < 0) {
      window.scrollBy(0, top - scrollOffset);
    } else if (bottom > innerHeight) {
      window.scrollBy(0, bottom - innerHeight + scrollOffset);
    }
  }

  public setToTheLastBlock(): void {
    const lastBlock = this.Editor.BlockManager.lastBlock;

    if (!lastBlock) {
      return;
    }

    if (lastBlock.tool.isDefault && lastBlock.isEmpty) {
      this.setToBlock(lastBlock);
    } else {
      const newBlock = this.Editor.BlockManager.insertAtEnd();

      this.setToBlock(newBlock);
    }
  }

  public extractFragmentFromCaretPosition(): void | DocumentFragment {
    const selection = Selection.get();

    if (selection.rangeCount) {
      const selectRange = selection.getRangeAt(0);
      const currentBlockInput =
        this.Editor.BlockManager.currentBlock.currentInput;

      selectRange.deleteContents();

      if (currentBlockInput) {
        if (Dom.isNativeInput(currentBlockInput)) {
          const input = currentBlockInput as
            | HTMLInputElement
            | HTMLTextAreaElement;
          const newFragment = document.createDocumentFragment();

          const inputRemainingText = input.value.substring(
            0,
            input.selectionStart,
          );
          const fragmentText = input.value.substring(input.selectionStart);

          newFragment.textContent = fragmentText;
          input.value = inputRemainingText;

          return newFragment;
        } else {
          const range = selectRange.cloneRange();

          range.selectNodeContents(currentBlockInput);
          range.setStart(selectRange.endContainer, selectRange.endOffset);

          return range.extractContents();
        }
      }
    }
  }

  public navigateNext(force = false): boolean {
    const { BlockManager } = this.Editor;
    const { currentBlock, nextBlock } = BlockManager;

    if (currentBlock === undefined) {
      return false;
    }

    const { nextInput, currentInput } = currentBlock;
    const isAtEnd =
      currentInput !== undefined
        ? caretUtils.isCaretAtEndOfInput(currentInput)
        : undefined;

    let blockToNavigate = nextBlock;

    const navigationAllowed = force || isAtEnd || !currentBlock.focusable;

    if (nextInput && navigationAllowed) {
      this.setToInput(nextInput, this.positions.START);

      return true;
    }

    if (blockToNavigate === null) {
      if (currentBlock.tool.isDefault || !navigationAllowed) {
        return false;
      }

      blockToNavigate = BlockManager.insertAtEnd() as Block;
    }

    if (navigationAllowed) {
      this.setToBlock(blockToNavigate, this.positions.START);

      return true;
    }

    return false;
  }

  public navigatePrevious(force = false): boolean {
    const { currentBlock, previousBlock } = this.Editor.BlockManager;

    if (!currentBlock) {
      return false;
    }

    const { previousInput, currentInput } = currentBlock;

    const caretAtStart =
      currentInput !== undefined
        ? caretUtils.isCaretAtStartOfInput(currentInput)
        : undefined;
    const navigationAllowed = force || caretAtStart || !currentBlock.focusable;

    if (previousInput && navigationAllowed) {
      this.setToInput(previousInput, this.positions.END);

      return true;
    }

    if (previousBlock !== null && navigationAllowed) {
      this.setToBlock(previousBlock as Block, this.positions.END);

      return true;
    }

    return false;
  }

  public createShadow(element: Element): void {
    const shadowCaret = document.createElement('span');

    shadowCaret.classList.add(Caret.CSS.shadowCaret);
    element.insertAdjacentElement('beforeend', shadowCaret);
  }

  public restoreCaret(element: HTMLElement): void {
    const shadowCaret = element.querySelector(`.${Caret.CSS.shadowCaret}`);

    if (!shadowCaret) {
      return;
    }

    const sel = new Selection();

    sel.expandToTag(shadowCaret as HTMLElement);

    const newRange = document.createRange();

    newRange.selectNode(shadowCaret);
    newRange.extractContents();
  }

  public insertContentAtCaretPosition(content: string): void {
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    const selection = Selection.get();
    const range = Selection.range;

    wrapper.innerHTML = content;

    Array.from(wrapper.childNodes).forEach((child: Node) =>
      fragment.appendChild(child),
    );

    if (fragment.childNodes.length === 0) {
      fragment.appendChild(new Text());
    }

    const lastChild = fragment.lastChild as ChildNode;

    range.deleteContents();
    range.insertNode(fragment);

    const newRange = document.createRange();

    const nodeToSetCaret =
      lastChild.nodeType === Node.TEXT_NODE ? lastChild : lastChild.firstChild;

    if (nodeToSetCaret !== null && nodeToSetCaret.textContent !== null) {
      newRange.setStart(nodeToSetCaret, nodeToSetCaret.textContent.length);
    }

    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}
