import Module from '@/components/__module';
import Dom from '@/components/dom';
import SelectionUtils from '@/components/selection';
import Block from '@/components/block';
import * as utilities from '@/components/utilities';

export default class RectangleSelection extends Module {
  public static get CSS(): { [name: string]: string } {
    return {
      overlay: 'codex-editor-overlay',
      overlayContainer: 'codex-editor-overlay__container',
      rect: 'codex-editor-overlay__rectangle',
      topScrollZone: 'codex-editor-overlay__scroll-zone--top',
      bottomScrollZone: 'codex-editor-overlay__scroll-zone--bottom',
    };
  }

  private isRectSelectionActivated = false;

  private readonly SCROLL_SPEED: number = 3;

  private readonly HEIGHT_OF_SCROLL_ZONE = 40;

  private readonly BOTTOM_SCROLL_ZONE = 1;
  private readonly TOP_SCROLL_ZONE = 2;

  private readonly MAIN_MOUSE_BUTTON = 0;

  private mousedown = false;

  private isScrolling = false;

  private inScrollZone: number | null = null;

  private startX = 0;
  private startY = 0;
  private mouseX = 0;
  private mouseY = 0;

  private stackOfSelected: number[] = [];

  private rectCrossesBlocks: boolean;

  private overlayRectangle: HTMLDivElement;

  private listenerIds: string[] = [];

  public prepare(): void {
    this.enableModuleBindings();
  }

  public startSelection(pageX, pageY): void {
    const elemWhereSelectionStart = document.elementFromPoint(
      pageX - window.pageXOffset,
      pageY - window.pageYOffset,
    );

    const startsInsideToolbar = elemWhereSelectionStart.closest(
      `.${this.Editor.Toolbar.CSS.toolbar}`,
    );

    if (!startsInsideToolbar) {
      this.Editor.BlockSelection.allBlocksSelected = false;
      this.clearSelection();
      this.stackOfSelected = [];
    }

    const selectorsToAvoid = [
      `.${Block.CSS.content}`,
      `.${this.Editor.Toolbar.CSS.toolbar}`,
      `.${this.Editor.InlineToolbar.CSS.inlineToolbar}`,
    ];

    const startsInsideEditor = elemWhereSelectionStart.closest(
      '.' + this.Editor.UI.CSS.editorWrapper,
    );
    const startsInSelectorToAvoid = selectorsToAvoid.some(
      (selector) => !!elemWhereSelectionStart.closest(selector),
    );

    if (!startsInsideEditor || startsInSelectorToAvoid) {
      return;
    }

    this.mousedown = true;
    this.startX = pageX;
    this.startY = pageY;
  }

  public endSelection(): void {
    this.mousedown = false;
    this.startX = 0;
    this.startY = 0;
    this.overlayRectangle.style.display = 'none';
  }

  public isRectActivated(): boolean {
    return this.isRectSelectionActivated;
  }

  public clearSelection(): void {
    this.isRectSelectionActivated = false;
  }

  private enableModuleBindings(): void {
    const { container } = this.genHTML();

    this.listeners.on(
      container,
      'mousedown',
      (mouseEvent: MouseEvent) => {
        this.processMouseDown(mouseEvent);
      },
      false,
    );

    this.listeners.on(
      document.body,
      'mousemove',
      utilities.throttle((mouseEvent: MouseEvent) => {
        this.processMouseMove(mouseEvent);
      }, 10),
      {
        passive: true,
      },
    );

    this.listeners.on(document.body, 'mouseleave', () => {
      this.processMouseLeave();
    });

    this.listeners.on(
      window,
      'scroll',
      utilities.throttle((mouseEvent: MouseEvent) => {
        this.processScroll(mouseEvent);
      }, 10),
      {
        passive: true,
      },
    );

    this.listeners.on(
      document.body,
      'mouseup',
      () => {
        this.processMouseUp();
      },
      false,
    );
  }

  private processMouseDown(mouseEvent: MouseEvent): void {
    if (mouseEvent.button !== this.MAIN_MOUSE_BUTTON) {
      return;
    }

    const startedFromContentEditable =
      (mouseEvent.target as Element).closest(Dom.allInputsSelector) !== null;

    if (!startedFromContentEditable) {
      this.startSelection(mouseEvent.pageX, mouseEvent.pageY);
    }
  }

  private processMouseMove(mouseEvent: MouseEvent): void {
    this.changingRectangle(mouseEvent);
    this.scrollByZones(mouseEvent.clientY);
  }

  private processMouseLeave(): void {
    this.clearSelection();
    this.endSelection();
  }

  private processScroll(mouseEvent: MouseEvent): void {
    this.changingRectangle(mouseEvent);
  }

  private processMouseUp(): void {
    this.clearSelection();
    this.endSelection();
  }

  private scrollByZones(clientY): void {
    this.inScrollZone = null;
    if (clientY <= this.HEIGHT_OF_SCROLL_ZONE) {
      this.inScrollZone = this.TOP_SCROLL_ZONE;
    }
    if (
      document.documentElement.clientHeight - clientY <=
      this.HEIGHT_OF_SCROLL_ZONE
    ) {
      this.inScrollZone = this.BOTTOM_SCROLL_ZONE;
    }

    if (!this.inScrollZone) {
      this.isScrolling = false;

      return;
    }

    if (!this.isScrolling) {
      this.scrollVertical(
        this.inScrollZone === this.TOP_SCROLL_ZONE
          ? -this.SCROLL_SPEED
          : this.SCROLL_SPEED,
      );
      this.isScrolling = true;
    }
  }

  private genHTML(): { container: Element; overlay: Element } {
    const { UI } = this.Editor;

    const container = UI.nodes.holder.querySelector('.' + UI.CSS.editorWrapper);
    const overlay = Dom.make('div', RectangleSelection.CSS.overlay, {});
    const overlayContainer = Dom.make(
      'div',
      RectangleSelection.CSS.overlayContainer,
      {},
    );
    const overlayRectangle = Dom.make('div', RectangleSelection.CSS.rect, {});

    overlayContainer.appendChild(overlayRectangle);
    overlay.appendChild(overlayContainer);
    container.appendChild(overlay);

    this.overlayRectangle = overlayRectangle as HTMLDivElement;

    return {
      container,
      overlay,
    };
  }

  private scrollVertical(speed): void {
    if (!(this.inScrollZone && this.mousedown)) {
      return;
    }
    const lastOffset = window.pageYOffset;

    window.scrollBy(0, speed);
    this.mouseY += window.pageYOffset - lastOffset;
    setTimeout(() => {
      this.scrollVertical(speed);
    }, 0);
  }

  private changingRectangle(event: MouseEvent): void {
    if (!this.mousedown) {
      return;
    }

    if (event.pageY !== undefined) {
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
    }

    const { rightPos, leftPos, index } = this.genInfoForMouseSelection();

    const rectIsOnRighSideOfredactor =
      this.startX > rightPos && this.mouseX > rightPos;
    const rectISOnLeftSideOfRedactor =
      this.startX < leftPos && this.mouseX < leftPos;

    this.rectCrossesBlocks = !(
      rectIsOnRighSideOfredactor || rectISOnLeftSideOfRedactor
    );

    if (!this.isRectSelectionActivated) {
      this.rectCrossesBlocks = false;
      this.isRectSelectionActivated = true;
      this.shrinkRectangleToPoint();
      this.overlayRectangle.style.display = 'block';
    }

    this.updateRectangleSize();

    this.Editor.Toolbar.close();

    if (index === undefined) {
      return;
    }

    this.trySelectNextBlock(index);

    this.inverseSelection();

    SelectionUtils.get().removeAllRanges();
  }

  private shrinkRectangleToPoint(): void {
    this.overlayRectangle.style.left = `${this.startX - window.pageXOffset}px`;
    this.overlayRectangle.style.top = `${this.startY - window.pageYOffset}px`;
    this.overlayRectangle.style.bottom = `calc(100% - ${
      this.startY - window.pageYOffset
    }px`;
    this.overlayRectangle.style.right = `calc(100% - ${
      this.startX - window.pageXOffset
    }px`;
  }

  private inverseSelection(): void {
    const firstBlockInStack = this.Editor.BlockManager.getBlockByIndex(
      this.stackOfSelected[0],
    );
    const isSelectedMode = firstBlockInStack.selected;

    if (this.rectCrossesBlocks && !isSelectedMode) {
      for (const it of this.stackOfSelected) {
        this.Editor.BlockSelection.selectBlockByIndex(it);
      }
    }

    if (!this.rectCrossesBlocks && isSelectedMode) {
      for (const it of this.stackOfSelected) {
        this.Editor.BlockSelection.unSelectBlockByIndex(it);
      }
    }
  }

  private updateRectangleSize(): void {
    if (this.mouseY >= this.startY) {
      this.overlayRectangle.style.top = `${this.startY - window.pageYOffset}px`;
      this.overlayRectangle.style.bottom = `calc(100% - ${
        this.mouseY - window.pageYOffset
      }px`;
    } else {
      this.overlayRectangle.style.bottom = `calc(100% - ${
        this.startY - window.pageYOffset
      }px`;
      this.overlayRectangle.style.top = `${this.mouseY - window.pageYOffset}px`;
    }

    if (this.mouseX >= this.startX) {
      this.overlayRectangle.style.left = `${
        this.startX - window.pageXOffset
      }px`;
      this.overlayRectangle.style.right = `calc(100% - ${
        this.mouseX - window.pageXOffset
      }px`;
    } else {
      this.overlayRectangle.style.right = `calc(100% - ${
        this.startX - window.pageXOffset
      }px`;
      this.overlayRectangle.style.left = `${
        this.mouseX - window.pageXOffset
      }px`;
    }
  }

  private genInfoForMouseSelection(): {
    index: number;
    leftPos: number;
    rightPos: number;
  } {
    const widthOfRedactor = document.body.offsetWidth;
    const centerOfRedactor = widthOfRedactor / 2;
    const Y = this.mouseY - window.pageYOffset;
    const elementUnderMouse = document.elementFromPoint(centerOfRedactor, Y);
    const blockInCurrentPos =
      this.Editor.BlockManager.getBlockByChildNode(elementUnderMouse);
    let index;

    if (blockInCurrentPos !== undefined) {
      index = this.Editor.BlockManager.blocks.findIndex(
        (block) => block.holder === blockInCurrentPos.holder,
      );
    }
    const contentElement =
      this.Editor.BlockManager.lastBlock.holder.querySelector(
        '.' + Block.CSS.content,
      );
    const centerOfBlock =
      Number.parseInt(window.getComputedStyle(contentElement).width, 10) / 2;
    const leftPos = centerOfRedactor - centerOfBlock;
    const rightPos = centerOfRedactor + centerOfBlock;

    return {
      index,
      leftPos,
      rightPos,
    };
  }

  private addBlockInSelection(index): void {
    if (this.rectCrossesBlocks) {
      this.Editor.BlockSelection.selectBlockByIndex(index);
    }
    this.stackOfSelected.push(index);
  }

  private trySelectNextBlock(index): void {
    const sameBlock =
      this.stackOfSelected[this.stackOfSelected.length - 1] === index;
    const sizeStack = this.stackOfSelected.length;
    const down = 1,
      up = -1,
      undef = 0;

    if (sameBlock) {
      return;
    }

    const blockNumbersIncrease =
      this.stackOfSelected[sizeStack - 1] -
        this.stackOfSelected[sizeStack - 2] >
      0;

    let direction = undef;

    if (sizeStack > 1) {
      direction = blockNumbersIncrease ? down : up;
    }

    const selectionInDownDirection =
      index > this.stackOfSelected[sizeStack - 1] && direction === down;
    const selectionInUpDirection =
      index < this.stackOfSelected[sizeStack - 1] && direction === up;
    const generalSelection =
      selectionInDownDirection || selectionInUpDirection || direction === undef;
    const reduction = !generalSelection;

    if (
      !reduction &&
      (index > this.stackOfSelected[sizeStack - 1] ||
        this.stackOfSelected[sizeStack - 1] === undefined)
    ) {
      let ind = this.stackOfSelected[sizeStack - 1] + 1 || index;

      for (ind; ind <= index; ind++) {
        this.addBlockInSelection(ind);
      }

      return;
    }

    if (!reduction && index < this.stackOfSelected[sizeStack - 1]) {
      for (
        let ind = this.stackOfSelected[sizeStack - 1] - 1;
        ind >= index;
        ind--
      ) {
        this.addBlockInSelection(ind);
      }

      return;
    }

    if (!reduction) {
      return;
    }

    let i = sizeStack - 1;
    let cmp;

    if (index > this.stackOfSelected[sizeStack - 1]) {
      cmp = (): boolean => index > this.stackOfSelected[i];
    } else {
      cmp = (): boolean => index < this.stackOfSelected[i];
    }

    while (cmp()) {
      if (this.rectCrossesBlocks) {
        this.Editor.BlockSelection.unSelectBlockByIndex(
          this.stackOfSelected[i],
        );
      }
      this.stackOfSelected.pop();
      i--;
    }
  }
}
