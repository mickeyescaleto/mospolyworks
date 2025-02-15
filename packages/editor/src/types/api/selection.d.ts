export type Selection = {
  findParentTag(tagName: string, className?: string): HTMLElement | null;
  expandToTag(node: HTMLElement): void;
  setFakeBackground(): void;
  removeFakeBackground(): void;
  save(): void;
  restore(): void;
};
