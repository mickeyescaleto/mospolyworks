export function isHtmlElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}
