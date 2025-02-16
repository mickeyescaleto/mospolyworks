export function make(
  tagName: string,
  classNames: string[] | string | null = null,
  attributes: { [key: string]: string | boolean } = {},
): HTMLElement {
  const el = document.createElement(tagName);

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames !== null) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    if (attributes.hasOwnProperty(attrName)) {
      (el as unknown as { [key: string]: string | boolean })[attrName] =
        attributes[attrName];
    }
  }

  return el;
}
