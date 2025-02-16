import Dom, { isCollapsedWhitespaces } from '@repo/editor/components/dom';

export function getCaretNodeAndOffset(): [Node | null, number] {
  const selection = window.getSelection();

  if (selection === null) {
    return [null, 0];
  }

  let focusNode = selection.focusNode;
  let focusOffset = selection.focusOffset;

  if (focusNode === null) {
    return [null, 0];
  }

  if (
    focusNode.nodeType !== Node.TEXT_NODE &&
    focusNode.childNodes.length > 0
  ) {
    if (focusNode.childNodes[focusOffset]) {
      focusNode = focusNode.childNodes[focusOffset];
      focusOffset = 0;
    } else {
      focusNode = focusNode.childNodes[focusOffset - 1];
      focusOffset = focusNode.textContent.length;
    }
  }

  return [focusNode, focusOffset];
}

export function checkContenteditableSliceForEmptiness(
  contenteditable: HTMLElement,
  fromNode: Node,
  offsetInsideNode: number,
  direction: 'left' | 'right',
): boolean {
  const range = document.createRange();

  if (direction === 'left') {
    range.setStart(contenteditable, 0);
    range.setEnd(fromNode, offsetInsideNode);
  } else {
    range.setStart(fromNode, offsetInsideNode);
    range.setEnd(contenteditable, contenteditable.childNodes.length);
  }

  const clonedContent = range.cloneContents();
  const tempDiv = document.createElement('div');

  tempDiv.appendChild(clonedContent);

  const textContent = tempDiv.textContent || '';

  return isCollapsedWhitespaces(textContent);
}

export function isCaretAtStartOfInput(input: HTMLElement): boolean {
  const firstNode = Dom.getDeepestNode(input);

  if (firstNode === null || Dom.isEmpty(input)) {
    return true;
  }

  if (Dom.isNativeInput(firstNode)) {
    return (firstNode as HTMLInputElement).selectionEnd === 0;
  }

  if (Dom.isEmpty(input)) {
    return true;
  }

  const [caretNode, caretOffset] = getCaretNodeAndOffset();

  if (caretNode === null) {
    return false;
  }

  return checkContenteditableSliceForEmptiness(
    input,
    caretNode,
    caretOffset,
    'left',
  );
}

export function isCaretAtEndOfInput(input: HTMLElement): boolean {
  const lastNode = Dom.getDeepestNode(input, true);

  if (lastNode === null) {
    return true;
  }

  if (Dom.isNativeInput(lastNode)) {
    return (
      (lastNode as HTMLInputElement).selectionEnd ===
      (lastNode as HTMLInputElement).value.length
    );
  }

  const [caretNode, caretOffset] = getCaretNodeAndOffset();

  if (caretNode === null) {
    return false;
  }

  return checkContenteditableSliceForEmptiness(
    input,
    caretNode,
    caretOffset,
    'right',
  );
}
