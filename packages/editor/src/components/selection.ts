import * as utilities from '@/components/utilities';
import Dom from '@/components/dom';

type TextRange = {
  boundingTop: number;
  boundingLeft: number;
  boundingBottom: number;
  boundingRight: number;
  boundingHeight: number;
  boundingWidth: number;
};

type MSSelection = {
  createRange(): TextRange;
  type: string;
};

type Document = {
  selection?: MSSelection;
};

export default class SelectionUtils {
  public instance: Selection = null;
  public selection: Selection = null;

  public savedSelectionRange: Range = null;

  public isFakeBackgroundEnabled = false;

  private readonly commandBackground: string = 'backColor';
  private readonly commandRemoveFormat: string = 'removeFormat';

  public static get CSS(): { editorWrapper: string; editorZone: string } {
    return {
      editorWrapper: 'codex-editor',
      editorZone: 'codex-editor__redactor',
    };
  }

  public static get anchorNode(): Node | null {
    const selection = window.getSelection();

    return selection ? selection.anchorNode : null;
  }

  public static get anchorElement(): Element | null {
    const selection = window.getSelection();

    if (!selection) {
      return null;
    }

    const anchorNode = selection.anchorNode;

    if (!anchorNode) {
      return null;
    }

    if (!Dom.isElement(anchorNode)) {
      return anchorNode.parentElement;
    } else {
      return anchorNode;
    }
  }

  public static get anchorOffset(): number | null {
    const selection = window.getSelection();

    return selection ? selection.anchorOffset : null;
  }

  public static get isCollapsed(): boolean | null {
    const selection = window.getSelection();

    return selection ? selection.isCollapsed : null;
  }

  public static get isAtEditor(): boolean {
    return this.isSelectionAtEditor(SelectionUtils.get());
  }

  public static isSelectionAtEditor(selection: Selection): boolean {
    if (!selection) {
      return false;
    }

    let selectedNode = (selection.anchorNode ||
      selection.focusNode) as HTMLElement;

    if (selectedNode && selectedNode.nodeType === Node.TEXT_NODE) {
      selectedNode = selectedNode.parentNode as HTMLElement;
    }

    let editorZone = null;

    if (selectedNode && selectedNode instanceof Element) {
      editorZone = selectedNode.closest(`.${SelectionUtils.CSS.editorZone}`);
    }

    return editorZone ? editorZone.nodeType === Node.ELEMENT_NODE : false;
  }

  public static isRangeAtEditor(range: Range): boolean {
    if (!range) {
      return;
    }

    let selectedNode = range.startContainer as HTMLElement;

    if (selectedNode && selectedNode.nodeType === Node.TEXT_NODE) {
      selectedNode = selectedNode.parentNode as HTMLElement;
    }

    let editorZone = null;

    if (selectedNode && selectedNode instanceof Element) {
      editorZone = selectedNode.closest(`.${SelectionUtils.CSS.editorZone}`);
    }

    return editorZone ? editorZone.nodeType === Node.ELEMENT_NODE : false;
  }

  public static get isSelectionExists(): boolean {
    const selection = SelectionUtils.get();

    return !!selection.anchorNode;
  }

  public static get range(): Range | null {
    return this.getRangeFromSelection(this.get());
  }

  public static getRangeFromSelection(selection: Selection): Range | null {
    return selection && selection.rangeCount ? selection.getRangeAt(0) : null;
  }

  public static get rect(): DOMRect | ClientRect {
    let sel: Selection | MSSelection = (document as Document).selection,
      range: TextRange | Range;

    let rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    } as DOMRect;

    if (sel && sel.type !== 'Control') {
      sel = sel as MSSelection;
      range = sel.createRange() as TextRange;
      rect.x = range.boundingLeft;
      rect.y = range.boundingTop;
      rect.width = range.boundingWidth;
      rect.height = range.boundingHeight;

      return rect;
    }

    if (!window.getSelection) {
      utilities.log('Method window.getSelection is not supported', 'warn');

      return rect;
    }

    sel = window.getSelection();

    if (sel.rangeCount === null || isNaN(sel.rangeCount)) {
      utilities.log(
        'Method SelectionUtils.rangeCount is not supported',
        'warn',
      );

      return rect;
    }

    if (sel.rangeCount === 0) {
      return rect;
    }

    range = sel.getRangeAt(0).cloneRange() as Range;

    if (range.getBoundingClientRect) {
      rect = range.getBoundingClientRect() as DOMRect;
    }
    if (rect.x === 0 && rect.y === 0) {
      const span = document.createElement('span');

      if (span.getBoundingClientRect) {
        span.appendChild(document.createTextNode('\u200b'));
        range.insertNode(span);
        rect = span.getBoundingClientRect() as DOMRect;

        const spanParent = span.parentNode;

        spanParent.removeChild(span);

        spanParent.normalize();
      }
    }

    return rect;
  }

  public static get text(): string {
    return window.getSelection ? window.getSelection().toString() : '';
  }

  public static get(): Selection | null {
    return window.getSelection();
  }

  public static setCursor(element: HTMLElement, offset = 0): DOMRect {
    const range = document.createRange();
    const selection = window.getSelection();

    if (Dom.isNativeInput(element)) {
      if (!Dom.canSetCaret(element)) {
        return;
      }

      element.focus();
      element.selectionStart = element.selectionEnd = offset;

      return element.getBoundingClientRect();
    }

    range.setStart(element, offset);
    range.setEnd(element, offset);

    selection.removeAllRanges();
    selection.addRange(range);

    return range.getBoundingClientRect();
  }

  public static isRangeInsideContainer(container: HTMLElement): boolean {
    const range = SelectionUtils.range;

    if (range === null) {
      return false;
    }

    return container.contains(range.startContainer);
  }

  public static addFakeCursor(): void {
    const range = SelectionUtils.range;

    if (range === null) {
      return;
    }

    const fakeCursor = Dom.make('span', 'codex-editor__fake-cursor');

    fakeCursor.dataset.mutationFree = 'true';

    range.collapse();
    range.insertNode(fakeCursor);
  }

  public static isFakeCursorInsideContainer(el: HTMLElement): boolean {
    return Dom.find(el, `.codex-editor__fake-cursor`) !== null;
  }

  public static removeFakeCursor(container: HTMLElement = document.body): void {
    const fakeCursor = Dom.find(container, `.codex-editor__fake-cursor`);

    if (!fakeCursor) {
      return;
    }

    fakeCursor.remove();
  }

  public removeFakeBackground(): void {
    if (!this.isFakeBackgroundEnabled) {
      return;
    }

    this.isFakeBackgroundEnabled = false;
    document.execCommand(this.commandRemoveFormat);
  }

  public setFakeBackground(): void {
    document.execCommand(this.commandBackground, false, '#a8d6ff');

    this.isFakeBackgroundEnabled = true;
  }

  public save(): void {
    this.savedSelectionRange = SelectionUtils.range;
  }

  public restore(): void {
    if (!this.savedSelectionRange) {
      return;
    }

    const sel = window.getSelection();

    sel.removeAllRanges();
    sel.addRange(this.savedSelectionRange);
  }

  public clearSaved(): void {
    this.savedSelectionRange = null;
  }

  public collapseToEnd(): void {
    const sel = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(sel.focusNode);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  public findParentTag(
    tagName: string,
    className?: string,
    searchDepth = 10,
  ): HTMLElement | null {
    const selection = window.getSelection();
    let parentTag = null;

    if (!selection || !selection.anchorNode || !selection.focusNode) {
      return null;
    }

    const boundNodes = [
      selection.anchorNode as HTMLElement,
      selection.focusNode as HTMLElement,
    ];

    boundNodes.forEach((parent) => {
      let searchDepthIterable = searchDepth;

      while (searchDepthIterable > 0 && parent.parentNode) {
        if (parent.tagName === tagName) {
          parentTag = parent;

          if (
            className &&
            parent.classList &&
            !parent.classList.contains(className)
          ) {
            parentTag = null;
          }

          if (parentTag) {
            break;
          }
        }

        parent = parent.parentNode as HTMLElement;
        searchDepthIterable--;
      }
    });

    return parentTag;
  }

  public expandToTag(element: HTMLElement): void {
    const selection = window.getSelection();

    selection.removeAllRanges();
    const range = document.createRange();

    range.selectNodeContents(element);
    selection.addRange(range);
  }
}
