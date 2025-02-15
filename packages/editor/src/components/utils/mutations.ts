export function isMutationBelongsToElement(
  mutationRecord: MutationRecord,
  element: Element,
): boolean {
  const { type, target, addedNodes, removedNodes } = mutationRecord;

  if (
    mutationRecord.type === 'attributes' &&
    mutationRecord.attributeName === 'data-empty'
  ) {
    return false;
  }

  if (element.contains(target)) {
    return true;
  }

  if (type === 'childList') {
    const elementAddedItself = Array.from(addedNodes).some(
      (node) => node === element,
    );

    if (elementAddedItself) {
      return true;
    }

    const elementRemovedItself = Array.from(removedNodes).some(
      (node) => node === element,
    );

    if (elementRemovedItself) {
      return true;
    }
  }

  return false;
}
