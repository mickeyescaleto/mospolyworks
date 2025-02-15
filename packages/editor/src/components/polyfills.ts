'use strict';

interface Element {
  matchesSelector(selector: string): boolean;
  mozMatchesSelector(selector: string): boolean;
  msMatchesSelector(selector: string): boolean;
  oMatchesSelector(selector: string): boolean;
  prepend(...nodes: Array<string | Node>): void;
  append(...nodes: Array<string | Node>): void;
}

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function (s): boolean {
      const matches = (this.document || this.ownerDocument).querySelectorAll(s);
      let i = matches.length;

      while (--i >= 0 && matches.item(i) !== this) {}

      return i > -1;
    };
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s): Element | null {
    let el = this;

    if (!document.documentElement.contains(el)) {
      return null;
    }

    do {
      if (el.matches(s)) {
        return el;
      }

      el = el.parentElement || el.parentNode;
    } while (el !== null);

    return null;
  };
}

if (!Element.prototype.prepend) {
  Element.prototype.prepend = function prepend(
    nodes: Array<Node | string> | Node | string,
  ): void {
    const docFrag = document.createDocumentFragment();

    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }

    nodes.forEach((node: Node | string) => {
      const isNode = node instanceof Node;

      docFrag.appendChild(
        isNode ? (node as Node) : document.createTextNode(node as string),
      );
    });

    this.insertBefore(docFrag, this.firstChild);
  };
}

interface Element {
  scrollIntoViewIfNeeded(centerIfNeeded?: boolean): void;
}

if (!Element.prototype.scrollIntoViewIfNeeded) {
  Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded): void {
    centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

    const parent = this.parentNode,
      parentComputedStyle = window.getComputedStyle(parent, null),
      parentBorderTopWidth = parseInt(
        parentComputedStyle.getPropertyValue('border-top-width'),
      ),
      parentBorderLeftWidth = parseInt(
        parentComputedStyle.getPropertyValue('border-left-width'),
      ),
      overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
      overBottom =
        this.offsetTop -
          parent.offsetTop +
          this.clientHeight -
          parentBorderTopWidth >
        parent.scrollTop + parent.clientHeight,
      overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
      overRight =
        this.offsetLeft -
          parent.offsetLeft +
          this.clientWidth -
          parentBorderLeftWidth >
        parent.scrollLeft + parent.clientWidth,
      alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop =
        this.offsetTop -
        parent.offsetTop -
        parent.clientHeight / 2 -
        parentBorderTopWidth +
        this.clientHeight / 2;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft =
        this.offsetLeft -
        parent.offsetLeft -
        parent.clientWidth / 2 -
        parentBorderLeftWidth +
        this.clientWidth / 2;
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      this.scrollIntoView(alignWithTop);
    }
  };
}

window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    const start = Date.now();

    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };
