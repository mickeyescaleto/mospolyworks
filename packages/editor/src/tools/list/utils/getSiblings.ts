export function getSiblings(
  element: HTMLElement,
  direction: 'after' | 'before' = 'after',
): Element[] | null {
  const siblings: Element[] = [];

  let nextElementSibling: HTMLElement;

  function getNextElementSibling(el: HTMLElement): HTMLElement {
    switch (direction) {
      case 'after':
        return el.nextElementSibling as HTMLElement;

      case 'before':
        return el.previousElementSibling as HTMLElement;
    }
  }

  nextElementSibling = getNextElementSibling(element);

  while (nextElementSibling !== null) {
    siblings.push(nextElementSibling);

    nextElementSibling = getNextElementSibling(nextElementSibling);
  }

  if (siblings.length !== 0) {
    return siblings;
  }

  return null;
}
