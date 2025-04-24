import Module from '@repo/editor/components/__module';
import Dom, { toggleEmptyMark } from '@repo/editor/components/dom';
import * as utilities from '@repo/editor/components/utilities';
import Selection from '@repo/editor/components/selection';
import Block from '@repo/editor/components/block';
import Flipper from '@repo/editor/components/flipper';
import { mobileScreenBreakpoint } from '@repo/editor/components/utilities';
import { BlockHovered } from '@repo/editor/components/events/block-hovered';
import { selectionChangeDebounceTimeout } from '@repo/editor/components/constants';
import { EditorMobileLayoutToggled } from '@repo/editor/components/events';
import styles from '@repo/editor/styles/main.css?inline';

type UINodes = {
  holder: HTMLElement;
  wrapper: HTMLElement;
  redactor: HTMLElement;
};

export default class UI extends Module<UINodes> {
  public get CSS(): {
    editorWrapper: string;
    editorZone: string;
    editorZoneHidden: string;
    editorEmpty: string;
    editorRtlFix: string;
  } {
    return {
      editorWrapper: 'editor',
      editorZone: 'editor__redactor',
      editorZoneHidden: 'editor__redactor--hidden',
      editorEmpty: 'editor--empty',
      editorRtlFix: 'editor--rtl',
    };
  }

  public get contentRect(): DOMRect {
    if (this.contentRectCache !== null) {
      return this.contentRectCache;
    }

    const someBlock = this.nodes.wrapper.querySelector(`.${Block.CSS.content}`);

    if (!someBlock) {
      return {
        width: 800,
        left: 0,
        right: 0,
      } as DOMRect;
    }

    this.contentRectCache = someBlock.getBoundingClientRect();

    return this.contentRectCache;
  }

  public isMobile = false;

  private contentRectCache: DOMRect | null = null;

  private resizeDebouncer: () => void = utilities.debounce(() => {
    this.windowResize();
  }, 200);

  private selectionChangeDebounced = utilities.debounce(() => {
    this.selectionChanged();
  }, selectionChangeDebounceTimeout);

  public async prepare(): Promise<void> {
    this.setIsMobile();
    this.make();
    this.loadStyles();
  }

  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      window.requestIdleCallback(
        () => {
          this.bindReadOnlySensitiveListeners();
        },
        {
          timeout: 2000,
        },
      );
    } else {
      this.unbindReadOnlySensitiveListeners();
    }
  }

  public checkEmptiness(): void {
    const { BlockManager } = this.Editor;

    this.nodes.wrapper.classList.toggle(
      this.CSS.editorEmpty,
      BlockManager.isEditorEmpty,
    );
  }

  public get someToolbarOpened(): boolean {
    const { Toolbar, BlockSettings, InlineToolbar } = this.Editor;

    return Boolean(
      BlockSettings.opened || InlineToolbar.opened || Toolbar.toolbox.opened,
    );
  }

  public get someFlipperButtonFocused(): boolean {
    if (this.Editor.Toolbar.toolbox.hasFocus()) {
      return true;
    }

    return Object.entries(this.Editor)
      .filter(([_moduleName, moduleClass]) => {
        return moduleClass.flipper instanceof Flipper;
      })
      .some(([_moduleName, moduleClass]) => {
        return moduleClass.flipper.hasFocus();
      });
  }

  public destroy(): void {
    this.nodes.holder.innerHTML = '';

    this.unbindReadOnlyInsensitiveListeners();
  }

  public closeAllToolbars(): void {
    const { Toolbar, BlockSettings, InlineToolbar } = this.Editor;

    BlockSettings.close();
    InlineToolbar.close();
    Toolbar.toolbox.close();
  }

  private documentTouchedListener = (event: Event): void => {
    this.documentTouched(event);
  };

  private setIsMobile(): void {
    const isMobile = window.innerWidth < mobileScreenBreakpoint;

    if (isMobile !== this.isMobile) {
      this.eventsDispatcher.emit(EditorMobileLayoutToggled, {
        isEnabled: this.isMobile,
      });
    }

    this.isMobile = isMobile;
  }

  private make(): void {
    this.nodes.holder = Dom.getHolder(this.config.holder);

    this.nodes.wrapper = Dom.make('div', [
      this.CSS.editorWrapper,
      ...(this.isRtl ? [this.CSS.editorRtlFix] : []),
    ]);
    this.nodes.redactor = Dom.make('div', this.CSS.editorZone);

    this.nodes.wrapper.appendChild(this.nodes.redactor);
    this.nodes.holder.appendChild(this.nodes.wrapper);

    this.bindReadOnlyInsensitiveListeners();
  }

  private loadStyles(): void {
    const styleTagId = 'editor-js-styles';

    if (Dom.get(styleTagId)) {
      return;
    }

    const tag = Dom.make('style', null, {
      id: styleTagId,
      textContent: styles.toString(),
    });

    if (
      this.config.style &&
      !utilities.isEmpty(this.config.style) &&
      this.config.style.nonce
    ) {
      tag.setAttribute('nonce', this.config.style.nonce);
    }

    Dom.prepend(document.head, tag);
  }

  private bindReadOnlyInsensitiveListeners(): void {
    this.listeners.on(
      document,
      'selectionchange',
      this.selectionChangeDebounced,
    );

    this.listeners.on(window, 'resize', this.resizeDebouncer, {
      passive: true,
    });

    this.listeners.on(
      this.nodes.redactor,
      'mousedown',
      this.documentTouchedListener,
      {
        capture: true,
        passive: true,
      },
    );

    this.listeners.on(
      this.nodes.redactor,
      'touchstart',
      this.documentTouchedListener,
      {
        capture: true,
        passive: true,
      },
    );
  }

  private unbindReadOnlyInsensitiveListeners(): void {
    this.listeners.off(
      document,
      'selectionchange',
      this.selectionChangeDebounced,
    );
    this.listeners.off(window, 'resize', this.resizeDebouncer);
    this.listeners.off(
      this.nodes.redactor,
      'mousedown',
      this.documentTouchedListener,
    );
    this.listeners.off(
      this.nodes.redactor,
      'touchstart',
      this.documentTouchedListener,
    );
  }

  private bindReadOnlySensitiveListeners(): void {
    this.readOnlyMutableListeners.on(
      this.nodes.redactor,
      'click',
      (event: MouseEvent) => {
        this.redactorClicked(event);
      },
      false,
    );

    this.readOnlyMutableListeners.on(
      document,
      'keydown',
      (event: KeyboardEvent) => {
        this.documentKeydown(event);
      },
      true,
    );

    this.readOnlyMutableListeners.on(
      document,
      'mousedown',
      (event: MouseEvent) => {
        this.documentClicked(event);
      },
      true,
    );

    this.watchBlockHoveredEvents();

    this.enableInputsEmptyMark();
  }

  private watchBlockHoveredEvents(): void {
    let blockHoveredEmitted;

    this.readOnlyMutableListeners.on(
      this.nodes.redactor,
      'mousemove',
      utilities.throttle((event: MouseEvent | TouchEvent) => {
        const hoveredBlock = (event.target as Element).closest('.editor-block');

        if (this.Editor.BlockSelection.anyBlockSelected) {
          return;
        }

        if (!hoveredBlock) {
          return;
        }

        if (blockHoveredEmitted === hoveredBlock) {
          return;
        }

        blockHoveredEmitted = hoveredBlock;

        this.eventsDispatcher.emit(BlockHovered, {
          block: this.Editor.BlockManager.getBlockByChildNode(hoveredBlock),
        });
      }, 20),
      {
        passive: true,
      },
    );
  }

  private unbindReadOnlySensitiveListeners(): void {
    this.readOnlyMutableListeners.clearAll();
  }

  private windowResize(): void {
    this.contentRectCache = null;

    this.setIsMobile();
  }

  private documentKeydown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case utilities.keyCodes.ENTER:
        this.enterPressed(event);
        break;

      case utilities.keyCodes.BACKSPACE:
      case utilities.keyCodes.DELETE:
        this.backspacePressed(event);
        break;

      case utilities.keyCodes.ESC:
        this.escapePressed(event);
        break;

      default:
        this.defaultBehaviour(event);
        break;
    }
  }

  private defaultBehaviour(event: KeyboardEvent): void {
    const { currentBlock } = this.Editor.BlockManager;
    const keyDownOnEditor = (event.target as HTMLElement).closest(
      `.${this.CSS.editorWrapper}`,
    );
    const isMetaKey =
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

    if (currentBlock !== undefined && keyDownOnEditor === null) {
      this.Editor.BlockEvents.keydown(event);

      return;
    }

    if (keyDownOnEditor || (currentBlock && isMetaKey)) {
      return;
    }

    this.Editor.BlockManager.unsetCurrentBlock();

    this.Editor.Toolbar.close();
  }

  private backspacePressed(event: KeyboardEvent): void {
    const { BlockManager, BlockSelection, Caret } = this.Editor;

    if (BlockSelection.anyBlockSelected && !Selection.isSelectionExists) {
      const selectionPositionIndex = BlockManager.removeSelectedBlocks();

      const newBlock = BlockManager.insertDefaultBlockAtIndex(
        selectionPositionIndex,
        true,
      );

      Caret.setToBlock(newBlock, Caret.positions.START);

      BlockSelection.clearSelection(event);

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  private escapePressed(event): void {
    this.Editor.BlockSelection.clearSelection(event);

    if (this.Editor.Toolbar.toolbox.opened) {
      this.Editor.Toolbar.toolbox.close();
      this.Editor.Caret.setToBlock(
        this.Editor.BlockManager.currentBlock,
        this.Editor.Caret.positions.END,
      );
    } else if (this.Editor.BlockSettings.opened) {
      this.Editor.BlockSettings.close();
    } else if (this.Editor.InlineToolbar.opened) {
      this.Editor.InlineToolbar.close();
    } else {
      this.Editor.Toolbar.close();
    }
  }

  private enterPressed(event: KeyboardEvent): void {
    const { BlockManager, BlockSelection } = this.Editor;

    if (this.someToolbarOpened) {
      return;
    }

    const hasPointerToBlock = BlockManager.currentBlockIndex >= 0;

    if (BlockSelection.anyBlockSelected && !Selection.isSelectionExists) {
      BlockSelection.clearSelection(event);

      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();

      return;
    }

    if (
      !this.someToolbarOpened &&
      hasPointerToBlock &&
      (event.target as HTMLElement).tagName === 'BODY'
    ) {
      const newBlock = this.Editor.BlockManager.insert();

      event.preventDefault();
      this.Editor.Caret.setToBlock(newBlock);

      this.Editor.Toolbar.moveAndOpen(newBlock);
    }

    this.Editor.BlockSelection.clearSelection(event);
  }

  private documentClicked(event: MouseEvent): void {
    if (!event.isTrusted) {
      return;
    }

    const target = event.target as HTMLElement;
    const clickedInsideOfEditor =
      this.nodes.holder.contains(target) || Selection.isAtEditor;

    if (!clickedInsideOfEditor) {
      this.Editor.BlockManager.unsetCurrentBlock();
      this.Editor.Toolbar.close();
    }

    const isClickedInsideBlockSettings =
      this.Editor.BlockSettings.nodes.wrapper?.contains(target);
    const isClickedInsideBlockSettingsToggler =
      this.Editor.Toolbar.nodes.settingsToggler?.contains(target);
    const doNotProcess =
      isClickedInsideBlockSettings || isClickedInsideBlockSettingsToggler;

    if (this.Editor.BlockSettings.opened && !doNotProcess) {
      this.Editor.BlockSettings.close();

      const clickedBlock = this.Editor.BlockManager.getBlockByChildNode(target);

      this.Editor.Toolbar.moveAndOpen(clickedBlock);
    }

    this.Editor.BlockSelection.clearSelection(event);
  }

  private documentTouched(event: Event): void {
    let clickedNode = event.target as HTMLElement;

    if (clickedNode === this.nodes.redactor) {
      const clientX =
        event instanceof MouseEvent
          ? event.clientX
          : (event as TouchEvent).touches[0].clientX;
      const clientY =
        event instanceof MouseEvent
          ? event.clientY
          : (event as TouchEvent).touches[0].clientY;

      clickedNode = document.elementFromPoint(clientX, clientY) as HTMLElement;
    }

    try {
      this.Editor.BlockManager.setCurrentBlockByChildNode(clickedNode);
    } catch (error) {
      if (!this.Editor.RectangleSelection.isRectActivated()) {
        this.Editor.Caret.setToTheLastBlock();
      }
    }

    if (!this.Editor.ReadOnly.isEnabled) {
      this.Editor.Toolbar.moveAndOpen();
    }
  }

  private redactorClicked(event: MouseEvent): void {
    if (!Selection.isCollapsed) {
      return;
    }

    const element = event.target as Element;
    const ctrlKey = event.metaKey || event.ctrlKey;

    if (Dom.isAnchor(element) && ctrlKey) {
      event.stopImmediatePropagation();
      event.stopPropagation();

      const href = element.getAttribute('href');
      const validUrl = utilities.getValidUrl(href);

      utilities.openTab(validUrl);

      return;
    }

    this.processBottomZoneClick(event);
  }

  private processBottomZoneClick(event: MouseEvent): void {
    const lastBlock = this.Editor.BlockManager.getBlockByIndex(-1);

    const lastBlockBottomCoord = Dom.offset(lastBlock.holder).bottom;
    const clickedCoord = event.pageY;
    const { BlockSelection } = this.Editor;
    const isClickedBottom =
      event.target instanceof Element &&
      event.target.isEqualNode(this.nodes.redactor) &&
      !BlockSelection.anyBlockSelected &&
      lastBlockBottomCoord < clickedCoord;

    if (isClickedBottom) {
      event.stopImmediatePropagation();
      event.stopPropagation();

      const { BlockManager, Caret, Toolbar } = this.Editor;

      if (
        !BlockManager.lastBlock.tool.isDefault ||
        !BlockManager.lastBlock.isEmpty
      ) {
        BlockManager.insertAtEnd();
      }

      Caret.setToTheLastBlock();
      Toolbar.moveAndOpen(BlockManager.lastBlock);
    }
  }

  private selectionChanged(): void {
    const { CrossBlockSelection, BlockSelection } = this.Editor;
    const focusedElement = Selection.anchorElement;

    if (CrossBlockSelection.isCrossBlockSelectionStarted) {
      if (BlockSelection.anyBlockSelected) {
        Selection.get().removeAllRanges();
      }
    }

    if (!focusedElement) {
      if (!Selection.range) {
        this.Editor.InlineToolbar.close();
      }

      return;
    }

    const closestBlock = focusedElement.closest(`.${Block.CSS.content}`);
    const clickedOutsideBlockContent =
      closestBlock === null ||
      closestBlock.closest(`.${Selection.CSS.editorWrapper}`) !==
        this.nodes.wrapper;

    if (clickedOutsideBlockContent) {
      if (!this.Editor.InlineToolbar.containsNode(focusedElement)) {
        this.Editor.InlineToolbar.close();
      }

      const inlineToolbarEnabledForExternalTool =
        (focusedElement as HTMLElement).dataset.inlineToolbar === 'true';

      if (!inlineToolbarEnabledForExternalTool) {
        return;
      }
    }

    if (!this.Editor.BlockManager.currentBlock) {
      this.Editor.BlockManager.setCurrentBlockByChildNode(focusedElement);
    }

    this.Editor.InlineToolbar.tryToShow(true);
  }

  private enableInputsEmptyMark(): void {
    function handleInputOrFocusChange(event: Event): void {
      const input = event.target as HTMLElement;

      toggleEmptyMark(input);
    }

    this.readOnlyMutableListeners.on(
      this.nodes.wrapper,
      'input',
      handleInputOrFocusChange,
    );
    this.readOnlyMutableListeners.on(
      this.nodes.wrapper,
      'focusin',
      handleInputOrFocusChange,
    );
    this.readOnlyMutableListeners.on(
      this.nodes.wrapper,
      'focusout',
      handleInputOrFocusChange,
    );
  }
}
