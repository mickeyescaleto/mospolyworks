import Module from '@repo/editor/components/__module';
import Dom from '@repo/editor/components/dom';
import SelectionUtils from '@repo/editor/components/selection';
import * as utilities from '@repo/editor/components/utilities';
import I18n from '@repo/editor/components/i18n';
import { I18nInternalNS } from '@repo/editor/components/i18n/namespace-internal';
import Shortcuts from '@repo/editor/components/utils/shortcuts';
import { CommonInternalSettings } from '@repo/editor/components/tools/base';
import { PopoverInline } from '@repo/editor/components/utils/popover/popover-inline';
import InlineToolAdapter from '@repo/editor/components/tools/inline';
import { PopoverItemType } from '@repo/editor/types/utils/popover/popover-item-type';

import type { ModuleConfig } from '@repo/editor/types-internal/module-config';
import type { Popover } from '@repo/editor/components/utils/popover';
import type {
  PopoverItemHtmlParams,
  PopoverItemParams,
  WithChildren,
} from '@repo/editor/types/utils/popover/popover-item';
import type { InlineTool as IInlineTool } from '@repo/editor/types/tools/inline-tool';

type InlineToolbarNodes = {
  wrapper: HTMLElement | undefined;
};

export default class InlineToolbar extends Module<InlineToolbarNodes> {
  public CSS = {
    inlineToolbar: 'editor-inline-toolbar',
  };

  public opened = false;

  private popover: Popover | null = null;

  private readonly toolbarVerticalMargin: number = utilities.isMobileScreen()
    ? 20
    : 6;

  private tools: Map<InlineToolAdapter, IInlineTool> = new Map();

  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });

    window.requestIdleCallback(
      () => {
        this.make();
      },
      { timeout: 2000 },
    );
  }

  public async tryToShow(needToClose = false): Promise<void> {
    if (needToClose) {
      this.close();
    }

    if (!this.allowedToShow()) {
      return;
    }

    await this.open();

    this.Editor.Toolbar.close();
  }

  public close(): void {
    if (!this.opened) {
      return;
    }

    for (const [tool, toolInstance] of this.tools) {
      const shortcut = this.getToolShortcut(tool.name);

      if (shortcut !== undefined) {
        Shortcuts.remove(this.Editor.UI.nodes.redactor, shortcut);
      }

      if (utilities.isFunction(toolInstance.clear)) {
        toolInstance.clear();
      }
    }

    this.tools = new Map();

    this.reset();
    this.opened = false;

    this.popover?.hide();
    this.popover?.destroy();
    this.popover = null;
  }

  public containsNode(node: Node): boolean {
    if (this.nodes.wrapper === undefined) {
      return false;
    }

    return this.nodes.wrapper.contains(node);
  }

  public destroy(): void {
    this.removeAllNodes();
    this.popover?.destroy();
    this.popover = null;
  }

  private make(): void {
    this.nodes.wrapper = Dom.make('div', [
      this.CSS.inlineToolbar,
      ...(this.isRtl ? [this.Editor.UI.CSS.editorRtlFix] : []),
    ]);

    Dom.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }

  private async open(): Promise<void> {
    if (this.opened) {
      return;
    }

    this.opened = true;

    if (this.popover !== null) {
      this.popover.destroy();
    }

    this.createToolsInstances();

    const popoverItems = await this.getPopoverItems();

    this.popover = new PopoverInline({
      items: popoverItems,
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: I18n.ui(I18nInternalNS.ui.popover, 'Nothing found'),
        search: I18n.ui(I18nInternalNS.ui.popover, 'Filter'),
      },
    });

    this.move(this.popover.size.width);

    this.nodes.wrapper?.append(this.popover.getElement());

    this.popover.show();
  }

  private move(popoverWidth: number): void {
    const selectionRect = SelectionUtils.rect as DOMRect;
    const wrapperOffset = this.Editor.UI.nodes.wrapper.getBoundingClientRect();
    const newCoords = {
      x: selectionRect.x - wrapperOffset.x,
      y:
        selectionRect.y +
        selectionRect.height -
        wrapperOffset.top +
        this.toolbarVerticalMargin,
    };

    const realRightCoord = newCoords.x + popoverWidth + wrapperOffset.x;

    if (realRightCoord > this.Editor.UI.contentRect.right) {
      newCoords.x =
        this.Editor.UI.contentRect.right - popoverWidth - wrapperOffset.x;
    }

    this.nodes.wrapper!.style.left = Math.floor(newCoords.x) + 'px';
    this.nodes.wrapper!.style.top = Math.floor(newCoords.y) + 'px';
  }

  private reset(): void {
    this.nodes.wrapper!.style.left = '0';
    this.nodes.wrapper!.style.top = '0';
  }

  private allowedToShow(): boolean {
    const tagsConflictsWithSelection = ['IMG', 'INPUT'];
    const currentSelection = SelectionUtils.get();
    const selectedText = SelectionUtils.text;

    if (!currentSelection || !currentSelection.anchorNode) {
      return false;
    }

    if (currentSelection.isCollapsed || selectedText.length < 1) {
      return false;
    }

    const target = !Dom.isElement(currentSelection.anchorNode)
      ? currentSelection.anchorNode.parentElement
      : currentSelection.anchorNode;

    if (target === null) {
      return false;
    }

    if (
      currentSelection !== null &&
      tagsConflictsWithSelection.includes(target.tagName)
    ) {
      return false;
    }

    const currentBlock = this.Editor.BlockManager.getBlock(
      currentSelection.anchorNode as HTMLElement,
    );

    if (!currentBlock) {
      return false;
    }

    const toolsAvailable = this.getTools();
    const isAtLeastOneToolAvailable = toolsAvailable.some((tool) =>
      currentBlock.tool.inlineTools.has(tool.name),
    );

    if (isAtLeastOneToolAvailable === false) {
      return false;
    }

    const contenteditable = target.closest('[contenteditable]');

    return contenteditable !== null;
  }

  private getTools(): InlineToolAdapter[] {
    const currentBlock = this.Editor.BlockManager.currentBlock;

    if (!currentBlock) {
      return [];
    }

    const inlineTools = Array.from(currentBlock.tool.inlineTools.values());

    return inlineTools.filter((tool) => {
      if (this.Editor.ReadOnly.isEnabled && tool.isReadOnlySupported !== true) {
        return false;
      }

      return true;
    });
  }

  private createToolsInstances(): void {
    this.tools = new Map();

    const tools = this.getTools();

    tools.forEach((tool) => {
      const instance = tool.create();

      this.tools.set(tool, instance);
    });
  }

  private async getPopoverItems(): Promise<PopoverItemParams[]> {
    const popoverItems = [] as PopoverItemParams[];

    let i = 0;

    for (const [tool, instance] of this.tools) {
      const renderedTool = await instance.render();

      const shortcut = this.getToolShortcut(tool.name);

      if (shortcut !== undefined) {
        try {
          this.enableShortcuts(tool.name, shortcut);
        } catch (e) {}
      }

      const shortcutBeautified =
        shortcut !== undefined
          ? utilities.beautifyShortcut(shortcut)
          : undefined;

      const toolTitle = I18n.t(
        I18nInternalNS.toolNames,
        tool.title || utilities.capitalize(tool.name),
      );

      [renderedTool].flat().forEach((item) => {
        const commonPopoverItemParams = {
          name: tool.name,
          onActivate: () => {
            this.toolClicked(instance);
          },
          hint: {
            title: toolTitle,
            description: shortcutBeautified,
          },
        } as PopoverItemParams;

        if (Dom.isElement(item)) {
          const popoverItem = {
            ...commonPopoverItemParams,
            element: item,
            type: PopoverItemType.Html,
          } as PopoverItemParams;

          if (utilities.isFunction(instance.renderActions)) {
            const actions = instance.renderActions();

            (popoverItem as WithChildren<PopoverItemHtmlParams>).children = {
              isOpen: instance.checkState?.(SelectionUtils.get()),
              isFlippable: false,
              items: [
                {
                  type: PopoverItemType.Html,
                  element: actions,
                },
              ],
            };
          } else {
            instance.checkState?.(SelectionUtils.get());
          }

          popoverItems.push(popoverItem);
        } else if (item.type === PopoverItemType.Html) {
          popoverItems.push({
            ...commonPopoverItemParams,
            ...item,
            type: PopoverItemType.Html,
          });
        } else if (item.type === PopoverItemType.Separator) {
          popoverItems.push({
            type: PopoverItemType.Separator,
          });
        } else {
          const popoverItem = {
            ...commonPopoverItemParams,
            ...item,
            type: PopoverItemType.Default,
          } as PopoverItemParams;

          if ('children' in popoverItem && i !== 0) {
            popoverItems.push({
              type: PopoverItemType.Separator,
            });
          }

          popoverItems.push(popoverItem);

          if ('children' in popoverItem && i < this.tools.size - 1) {
            popoverItems.push({
              type: PopoverItemType.Separator,
            });
          }
        }
      });

      i++;
    }

    return popoverItems;
  }

  private getToolShortcut(toolName: string): string | undefined {
    const { Tools } = this.Editor;

    const tool = Tools.inlineTools.get(toolName);

    const internalTools = Tools.internal.inlineTools;

    if (Array.from(internalTools.keys()).includes(toolName)) {
      return this.inlineTools[toolName][CommonInternalSettings.Shortcut];
    }

    return tool?.shortcut;
  }

  private enableShortcuts(toolName: string, shortcut: string): void {
    Shortcuts.add({
      name: shortcut,
      handler: (event) => {
        const { currentBlock } = this.Editor.BlockManager;

        if (!currentBlock) {
          return;
        }

        if (!currentBlock.tool.enabledInlineTools) {
          return;
        }

        event.preventDefault();

        this.popover?.activateItemByName(toolName);
      },
      on: document,
    });
  }

  private toolClicked(tool: IInlineTool): void {
    const range = SelectionUtils.range;

    tool.surround?.(range);
    this.checkToolsState();
  }

  private checkToolsState(): void {
    this.tools?.forEach((toolInstance) => {
      toolInstance.checkState?.(SelectionUtils.get());
    });
  }

  private get inlineTools(): { [name: string]: IInlineTool } {
    const result = {} as { [name: string]: IInlineTool };

    Array.from(this.Editor.Tools.inlineTools.entries()).forEach(
      ([name, tool]) => {
        result[name] = tool.create();
      },
    );

    return result;
  }
}
