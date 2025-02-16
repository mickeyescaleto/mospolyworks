import * as utilities from '@repo/editor/components/utilities';

export default class Dom {
  public static isSingleTag(tag: HTMLElement): boolean {
    return (
      tag.tagName &&
      [
        'AREA',
        'BASE',
        'BR',
        'COL',
        'COMMAND',
        'EMBED',
        'HR',
        'IMG',
        'INPUT',
        'KEYGEN',
        'LINK',
        'META',
        'PARAM',
        'SOURCE',
        'TRACK',
        'WBR',
      ].includes(tag.tagName)
    );
  }

  public static isLineBreakTag(element: HTMLElement): element is HTMLBRElement {
    return (
      element && element.tagName && ['BR', 'WBR'].includes(element.tagName)
    );
  }

  public static make(
    tagName: string,
    classNames: string | (string | undefined)[] | null = null,
    attributes: object = {},
  ): HTMLElement {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      const validClassnames = classNames.filter(
        (className) => className !== undefined,
      ) as string[];

      el.classList.add(...validClassnames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, attrName)) {
        el[attrName] = attributes[attrName];
      }
    }

    return el;
  }

  public static text(content: string): Text {
    return document.createTextNode(content);
  }

  public static append(
    parent: Element | DocumentFragment,
    elements: Element | Element[] | DocumentFragment | Text | Text[],
  ): void {
    if (Array.isArray(elements)) {
      elements.forEach((el) => parent.appendChild(el));
    } else {
      parent.appendChild(elements);
    }
  }

  public static prepend(parent: Element, elements: Element | Element[]): void {
    if (Array.isArray(elements)) {
      elements = elements.reverse();
      elements.forEach((el) => parent.prepend(el));
    } else {
      parent.prepend(elements);
    }
  }

  public static swap(el1: HTMLElement, el2: HTMLElement): void {
    const temp = document.createElement('div'),
      parent = el1.parentNode;

    parent.insertBefore(temp, el1);

    parent.insertBefore(el1, el2);

    parent.insertBefore(el2, temp);

    parent.removeChild(temp);
  }

  public static find(
    el: Element | Document = document,
    selector: string,
  ): Element | null {
    return el.querySelector(selector);
  }

  public static get(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  public static findAll(
    el: Element | Document = document,
    selector: string,
  ): NodeList {
    return el.querySelectorAll(selector);
  }

  public static get allInputsSelector(): string {
    const allowedInputTypes = [
      'text',
      'password',
      'email',
      'number',
      'search',
      'tel',
      'url',
    ];

    return (
      '[contenteditable=true], textarea, input:not([type]), ' +
      allowedInputTypes.map((type) => `input[type="${type}"]`).join(', ')
    );
  }

  public static findAllInputs(holder: Element): HTMLElement[] {
    return utilities
      .array(holder.querySelectorAll(Dom.allInputsSelector))
      .reduce((result, input) => {
        if (Dom.isNativeInput(input) || Dom.containsOnlyInlineElements(input)) {
          return [...result, input];
        }

        return [...result, ...Dom.getDeepestBlockElements(input)];
      }, []);
  }

  public static getDeepestNode(node: Node, atLast = false): Node | null {
    const child = atLast ? 'lastChild' : 'firstChild',
      sibling = atLast ? 'previousSibling' : 'nextSibling';

    if (node && node.nodeType === Node.ELEMENT_NODE && node[child]) {
      let nodeChild = node[child] as Node;

      if (
        Dom.isSingleTag(nodeChild as HTMLElement) &&
        !Dom.isNativeInput(nodeChild) &&
        !Dom.isLineBreakTag(nodeChild as HTMLElement)
      ) {
        if (nodeChild[sibling]) {
          nodeChild = nodeChild[sibling];
        } else if (nodeChild.parentNode[sibling]) {
          nodeChild = nodeChild.parentNode[sibling];
        } else {
          return nodeChild.parentNode;
        }
      }

      return this.getDeepestNode(nodeChild, atLast);
    }

    return node;
  }

  public static isElement(node: any): node is Element {
    if (utilities.isNumber(node)) {
      return false;
    }

    return node && node.nodeType && node.nodeType === Node.ELEMENT_NODE;
  }

  public static isFragment(node: any): node is DocumentFragment {
    if (utilities.isNumber(node)) {
      return false;
    }

    return (
      node && node.nodeType && node.nodeType === Node.DOCUMENT_FRAGMENT_NODE
    );
  }

  public static isContentEditable(element: HTMLElement): boolean {
    return element.contentEditable === 'true';
  }

  public static isNativeInput(
    target: any,
  ): target is HTMLInputElement | HTMLTextAreaElement {
    const nativeInputs = ['INPUT', 'TEXTAREA'];

    return target && target.tagName
      ? nativeInputs.includes(target.tagName)
      : false;
  }

  public static canSetCaret(target: HTMLElement): boolean {
    let result = true;

    if (Dom.isNativeInput(target)) {
      switch (target.type) {
        case 'file':
        case 'checkbox':
        case 'radio':
        case 'hidden':
        case 'submit':
        case 'button':
        case 'image':
        case 'reset':
          result = false;
          break;
      }
    } else {
      result = Dom.isContentEditable(target);
    }

    return result;
  }

  public static isNodeEmpty(node: Node, ignoreChars?: string): boolean {
    let nodeText;

    if (
      this.isSingleTag(node as HTMLElement) &&
      !this.isLineBreakTag(node as HTMLElement)
    ) {
      return false;
    }

    if (this.isElement(node) && this.isNativeInput(node)) {
      nodeText = (node as HTMLInputElement).value;
    } else {
      nodeText = node.textContent.replace('\u200B', '');
    }

    if (ignoreChars) {
      nodeText = nodeText.replace(new RegExp(ignoreChars, 'g'), '');
    }

    return nodeText.length === 0;
  }

  public static isLeaf(node: Node): boolean {
    if (!node) {
      return false;
    }

    return node.childNodes.length === 0;
  }

  public static isEmpty(node: Node, ignoreChars?: string): boolean {
    const treeWalker = [node];

    while (treeWalker.length > 0) {
      node = treeWalker.shift();

      if (!node) {
        continue;
      }

      if (this.isLeaf(node) && !this.isNodeEmpty(node, ignoreChars)) {
        return false;
      }

      if (node.childNodes) {
        treeWalker.push(...Array.from(node.childNodes));
      }
    }

    return true;
  }

  public static isHTMLString(str: string): boolean {
    const wrapper = Dom.make('div');

    wrapper.innerHTML = str;

    return wrapper.childElementCount > 0;
  }

  public static getContentLength(node: Node): number {
    if (Dom.isNativeInput(node)) {
      return (node as HTMLInputElement).value.length;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return (node as Text).length;
    }

    return node.textContent.length;
  }

  public static get blockElements(): string[] {
    return [
      'address',
      'article',
      'aside',
      'blockquote',
      'canvas',
      'div',
      'dl',
      'dt',
      'fieldset',
      'figcaption',
      'figure',
      'footer',
      'form',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'header',
      'hgroup',
      'hr',
      'li',
      'main',
      'nav',
      'noscript',
      'ol',
      'output',
      'p',
      'pre',
      'ruby',
      'section',
      'table',
      'tbody',
      'thead',
      'tr',
      'tfoot',
      'ul',
      'video',
    ];
  }

  public static containsOnlyInlineElements(
    data: string | HTMLElement,
  ): boolean {
    let wrapper: HTMLElement;

    if (utilities.isString(data)) {
      wrapper = document.createElement('div');
      wrapper.innerHTML = data;
    } else {
      wrapper = data;
    }

    const check = (element: HTMLElement): boolean => {
      return (
        !Dom.blockElements.includes(element.tagName.toLowerCase()) &&
        Array.from(element.children).every(check)
      );
    };

    return Array.from(wrapper.children).every(check);
  }

  public static getDeepestBlockElements(parent: HTMLElement): HTMLElement[] {
    if (Dom.containsOnlyInlineElements(parent)) {
      return [parent];
    }

    return Array.from(parent.children).reduce((result, element) => {
      return [
        ...result,
        ...Dom.getDeepestBlockElements(element as HTMLElement),
      ];
    }, []);
  }

  public static getHolder(element: string | HTMLElement): HTMLElement {
    if (utilities.isString(element)) {
      return document.getElementById(element);
    }

    return element;
  }

  public static isAnchor(element: Element): element is HTMLAnchorElement {
    return element.tagName.toLowerCase() === 'a';
  }

  public static offset(el): {
    top: number;
    left: number;
    right: number;
    bottom: number;
  } {
    const rect = el.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const top = rect.top + scrollTop;
    const left = rect.left + scrollLeft;

    return {
      top,
      left,
      bottom: top + rect.height,
      right: left + rect.width,
    };
  }
}

export function isCollapsedWhitespaces(textContent: string): boolean {
  return !/[^\t\n\r ]/.test(textContent);
}

export function calculateBaseline(element: Element): number {
  const style = window.getComputedStyle(element);
  const fontSize = parseFloat(style.fontSize);
  const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;
  const paddingTop = parseFloat(style.paddingTop);
  const borderTopWidth = parseFloat(style.borderTopWidth);
  const marginTop = parseFloat(style.marginTop);

  const baselineOffset = fontSize * 0.8;

  const extraLineHeight = (lineHeight - fontSize) / 2;

  const baselineY =
    marginTop + borderTopWidth + paddingTop + extraLineHeight + baselineOffset;

  return baselineY;
}

export function toggleEmptyMark(element: HTMLElement): void {
  element.dataset.empty = Dom.isEmpty(element) ? 'true' : 'false';
}
