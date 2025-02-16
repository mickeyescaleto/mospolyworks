import SelectionUtils from '@repo/editor/components/selection';
import Module from '@repo/editor/components/__module';

import type { Selection as SelectionAPIInterface } from '@repo/editor/types/api/selection';

export default class SelectionAPI extends Module {
  private selectionUtils = new SelectionUtils();

  public get methods(): SelectionAPIInterface {
    return {
      findParentTag: (
        tagName: string,
        className?: string,
      ): HTMLElement | null => this.findParentTag(tagName, className),
      expandToTag: (node: HTMLElement): void => this.expandToTag(node),
      save: () => this.selectionUtils.save(),
      restore: () => this.selectionUtils.restore(),
      setFakeBackground: () => this.selectionUtils.setFakeBackground(),
      removeFakeBackground: () => this.selectionUtils.removeFakeBackground(),
    };
  }

  public findParentTag(
    tagName: string,
    className?: string,
  ): HTMLElement | null {
    return this.selectionUtils.findParentTag(tagName, className);
  }

  public expandToTag(node: HTMLElement): void {
    this.selectionUtils.expandToTag(node);
  }
}
