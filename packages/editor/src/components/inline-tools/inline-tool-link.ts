import { IconLink, IconUnlink } from '@codexteam/icons';
import * as utilities from '@repo/editor/components/utilities';
import SelectionUtils from '@repo/editor/components/selection';

import type { Notifier } from '@repo/editor/types/api/notifier';
import type { Toolbar } from '@repo/editor/types/api/toolbar';
import type { I18n } from '@repo/editor/types/api/i18n';
import type { InlineToolbar } from '@repo/editor/types/api/inline-toolbar';
import type { API } from '@repo/editor/types';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';
import type { InlineTool } from '@repo/editor/types/tools/inline-tool';

export default class LinkInlineTool implements InlineTool {
  public static isInline = true;

  public static title = 'Link';

  public static get sanitize(): SanitizerConfig {
    return {
      a: {
        href: true,
        target: '_blank',
        rel: 'nofollow',
      },
    } as SanitizerConfig;
  }

  private readonly commandLink: string = 'createLink';
  private readonly commandUnlink: string = 'unlink';

  private readonly ENTER_KEY: number = 13;

  private readonly CSS = {
    button: 'editor-inline-tool',
    buttonActive: 'editor-inline-tool--active',
    buttonModifier: 'editor-inline-tool--link',
    buttonUnlink: 'editor-inline-tool--unlink',
    input: 'editor-inline-tool-input',
    inputShowed: 'editor-inline-tool-input--showed',
  };

  private nodes: {
    button: HTMLButtonElement;
    input: HTMLInputElement;
  } = {
    button: null,
    input: null,
  };

  private selection: SelectionUtils;

  private inputOpened = false;

  private toolbar: Toolbar;

  private inlineToolbar: InlineToolbar;

  private notifier: Notifier;

  private i18n: I18n;

  constructor({ api }: { api: API }) {
    this.toolbar = api.toolbar;
    this.inlineToolbar = api.inlineToolbar;
    this.notifier = api.notifier;
    this.i18n = api.i18n;
    this.selection = new SelectionUtils();
  }

  public render(): HTMLElement {
    this.nodes.button = document.createElement('button') as HTMLButtonElement;
    this.nodes.button.type = 'button';
    this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);

    this.nodes.button.innerHTML = IconLink;

    return this.nodes.button;
  }

  public renderActions(): HTMLElement {
    this.nodes.input = document.createElement('input') as HTMLInputElement;
    this.nodes.input.placeholder = this.i18n.t('Add a link');
    this.nodes.input.enterKeyHint = 'done';
    this.nodes.input.classList.add(this.CSS.input);
    this.nodes.input.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === this.ENTER_KEY) {
        this.enterPressed(event);
      }
    });

    return this.nodes.input;
  }

  public surround(range: Range): void {
    if (range) {
      if (!this.inputOpened) {
        this.selection.setFakeBackground();
        this.selection.save();
      } else {
        this.selection.restore();
        this.selection.removeFakeBackground();
      }
      const parentAnchor = this.selection.findParentTag('A');

      if (parentAnchor) {
        this.selection.expandToTag(parentAnchor);
        this.unlink();
        this.closeActions();
        this.checkState();
        this.toolbar.close();

        return;
      }
    }

    this.toggleActions();
  }

  public checkState(): boolean {
    const anchorTag = this.selection.findParentTag('A');

    if (anchorTag) {
      this.nodes.button.innerHTML = IconUnlink;
      this.nodes.button.classList.add(this.CSS.buttonUnlink);
      this.nodes.button.classList.add(this.CSS.buttonActive);
      this.openActions();

      const hrefAttr = anchorTag.getAttribute('href');

      this.nodes.input.value = hrefAttr !== 'null' ? hrefAttr : '';

      this.selection.save();
    } else {
      this.nodes.button.innerHTML = IconLink;
      this.nodes.button.classList.remove(this.CSS.buttonUnlink);
      this.nodes.button.classList.remove(this.CSS.buttonActive);
    }

    return !!anchorTag;
  }

  public clear(): void {
    this.closeActions();
  }

  public get shortcut(): string {
    return 'CMD+K';
  }

  private toggleActions(): void {
    if (!this.inputOpened) {
      this.openActions(true);
    } else {
      this.closeActions(false);
    }
  }

  private openActions(needFocus = false): void {
    this.nodes.input.classList.add(this.CSS.inputShowed);
    if (needFocus) {
      this.nodes.input.focus();
    }
    this.inputOpened = true;
  }

  private closeActions(clearSavedSelection = true): void {
    if (this.selection.isFakeBackgroundEnabled) {
      const currentSelection = new SelectionUtils();

      currentSelection.save();

      this.selection.restore();
      this.selection.removeFakeBackground();

      currentSelection.restore();
    }

    this.nodes.input.classList.remove(this.CSS.inputShowed);
    this.nodes.input.value = '';
    if (clearSavedSelection) {
      this.selection.clearSaved();
    }
    this.inputOpened = false;
  }

  private enterPressed(event: KeyboardEvent): void {
    let value = this.nodes.input.value || '';

    if (!value.trim()) {
      this.selection.restore();
      this.unlink();
      event.preventDefault();
      this.closeActions();

      return;
    }

    if (!this.validateURL(value)) {
      this.notifier.show({
        message: this.i18n.t('Pasted link is not valid'),
      });

      utilities.log('Incorrect Link pasted', 'warn', value);

      return;
    }

    value = this.prepareLink(value);

    this.selection.restore();
    this.selection.removeFakeBackground();

    this.insertLink(value);

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.selection.collapseToEnd();
    this.inlineToolbar.close();
  }

  private validateURL(str: string): boolean {
    return !/\s/.test(str);
  }

  private prepareLink(link: string): string {
    link = link.trim();
    link = this.addProtocol(link);

    return link;
  }

  private addProtocol(link: string): string {
    if (/^(\w+):(\/\/)?/.test(link)) {
      return link;
    }

    const isInternal = /^\/[^/\s]/.test(link),
      isAnchor = link.substring(0, 1) === '#',
      isProtocolRelative = /^\/\/[^/\s]/.test(link);

    if (!isInternal && !isAnchor && !isProtocolRelative) {
      link = 'http://' + link;
    }

    return link;
  }

  private insertLink(link: string): void {
    const anchorTag = this.selection.findParentTag('A');

    if (anchorTag) {
      this.selection.expandToTag(anchorTag);
    }

    document.execCommand(this.commandLink, false, link);
  }

  private unlink(): void {
    document.execCommand(this.commandUnlink);
  }
}
