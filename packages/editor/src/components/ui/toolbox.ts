import Dom from '@repo/editor/components/dom';
import * as utilities from '@repo/editor/components/utilities';
import { BlockToolAPI } from '@repo/editor/components/block';
import Shortcuts from '@repo/editor/components/utils/shortcuts';
import EventsDispatcher from '@repo/editor/components/utils/events';
import I18n from '@repo/editor/components/i18n';
import { I18nInternalNS } from '@repo/editor/components/i18n/namespace-internal';
import Listeners from '@repo/editor/components/utils/listeners';
import {
  PopoverDesktop,
  PopoverMobile,
} from '@repo/editor/components/utils/popover';
import { EditorMobileLayoutToggled } from '@repo/editor/components/events';
import BlockToolAdapter from '@repo/editor/components/tools/block';
import ToolsCollection from '@repo/editor/components/tools/collection';
import { PopoverEvent } from '@repo/editor/types/utils/popover/popover-event';

import type { Popover } from '@repo/editor/components/utils/popover';
import type { API } from '@repo/editor/types';
import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';
import type { ToolboxConfigEntry } from '@repo/editor/types/tools/tool-settings';
import type { PopoverItemParams } from '@repo/editor/types/utils/popover/popover-item';
import type { BlockAPI } from '@repo/editor/types/api/block';

export enum ToolboxEvent {
  Opened = 'toolbox-opened',
  Closed = 'toolbox-closed',
  BlockAdded = 'toolbox-block-added',
}

export type ToolboxEventMap = {
  [ToolboxEvent.Opened]: undefined;
  [ToolboxEvent.Closed]: undefined;
  [ToolboxEvent.BlockAdded]: {
    block: BlockAPI;
  };
};

type ToolboxTextLabelsKeys = 'filter' | 'nothingFound';

export default class Toolbox extends EventsDispatcher<ToolboxEventMap> {
  public get isEmpty(): boolean {
    return this.toolsToBeDisplayed.length === 0;
  }

  public opened = false;

  protected listeners: Listeners = new Listeners();

  private api: API;

  private popover: Popover | null = null;

  private tools: ToolsCollection<BlockToolAdapter>;

  private i18nLabels: Record<ToolboxTextLabelsKeys, string>;

  private nodes: {
    toolbox: HTMLElement;
  };

  private static get CSS(): {
    toolbox: string;
  } {
    return {
      toolbox: 'ce-toolbox',
    };
  }

  constructor({
    api,
    tools,
    i18nLabels,
  }: {
    api: API;
    tools: ToolsCollection<BlockToolAdapter>;
    i18nLabels: Record<ToolboxTextLabelsKeys, string>;
  }) {
    super();

    this.api = api;
    this.tools = tools;
    this.i18nLabels = i18nLabels;

    this.enableShortcuts();

    this.nodes = {
      toolbox: Dom.make('div', Toolbox.CSS.toolbox),
    };

    this.initPopover();

    this.api.events.on(
      EditorMobileLayoutToggled,
      this.handleMobileLayoutToggle,
    );
  }

  public getElement(): HTMLElement | null {
    return this.nodes.toolbox;
  }

  public hasFocus(): boolean | undefined {
    if (this.popover === null) {
      return;
    }

    return 'hasFocus' in this.popover ? this.popover.hasFocus() : undefined;
  }

  public destroy(): void {
    super.destroy();

    if (this.nodes && this.nodes.toolbox) {
      this.nodes.toolbox.remove();
    }

    this.removeAllShortcuts();
    this.popover?.off(PopoverEvent.Closed, this.onPopoverClose);
    this.listeners.destroy();
    this.api.events.off(
      EditorMobileLayoutToggled,
      this.handleMobileLayoutToggle,
    );
  }

  public toolButtonActivated(
    toolName: string,
    blockDataOverrides: BlockToolData,
  ): void {
    this.insertNewBlock(toolName, blockDataOverrides);
  }

  public open(): void {
    if (this.isEmpty) {
      return;
    }

    this.popover?.show();
    this.opened = true;
    this.emit(ToolboxEvent.Opened);
  }

  public close(): void {
    this.popover?.hide();
    this.opened = false;
    this.emit(ToolboxEvent.Closed);
  }

  public toggle(): void {
    if (!this.opened) {
      this.open();
    } else {
      this.close();
    }
  }

  public handleMobileLayoutToggle = (): void => {
    this.destroyPopover();
    this.initPopover();
  };

  private initPopover(): void {
    const PopoverClass = utilities.isMobileScreen()
      ? PopoverMobile
      : PopoverDesktop;

    this.popover = new PopoverClass({
      scopeElement: this.api.ui.nodes.redactor,
      searchable: true,
      messages: {
        nothingFound: this.i18nLabels.nothingFound,
        search: this.i18nLabels.filter,
      },
      items: this.toolboxItemsToBeDisplayed,
    });

    this.popover.on(PopoverEvent.Closed, this.onPopoverClose);
    this.nodes.toolbox?.append(this.popover.getElement());
  }

  private destroyPopover(): void {
    if (this.popover !== null) {
      this.popover.hide();
      this.popover.off(PopoverEvent.Closed, this.onPopoverClose);
      this.popover.destroy();
      this.popover = null;
    }

    if (this.nodes.toolbox !== null) {
      this.nodes.toolbox.innerHTML = '';
    }
  }

  private onPopoverClose = (): void => {
    this.opened = false;
    this.emit(ToolboxEvent.Closed);
  };

  @utilities.cacheable
  private get toolsToBeDisplayed(): BlockToolAdapter[] {
    const result: BlockToolAdapter[] = [];

    this.tools.forEach((tool) => {
      const toolToolboxSettings = tool.toolbox;

      if (toolToolboxSettings) {
        result.push(tool);
      }
    });

    return result;
  }

  @utilities.cacheable
  private get toolboxItemsToBeDisplayed(): PopoverItemParams[] {
    const toPopoverItem = (
      toolboxItem: ToolboxConfigEntry,
      tool: BlockToolAdapter,
      displaySecondaryLabel = true,
    ): PopoverItemParams => {
      return {
        icon: toolboxItem.icon,
        title: I18n.t(
          I18nInternalNS.toolNames,
          toolboxItem.title || utilities.capitalize(tool.name),
        ),
        name: tool.name,
        onActivate: (): void => {
          this.toolButtonActivated(tool.name, toolboxItem.data);
        },
        secondaryLabel:
          tool.shortcut && displaySecondaryLabel
            ? utilities.beautifyShortcut(tool.shortcut)
            : '',
      };
    };

    return this.toolsToBeDisplayed.reduce<PopoverItemParams[]>(
      (result, tool) => {
        if (Array.isArray(tool.toolbox)) {
          tool.toolbox.forEach((item, index) => {
            result.push(toPopoverItem(item, tool, index === 0));
          });
        } else if (tool.toolbox !== undefined) {
          result.push(toPopoverItem(tool.toolbox, tool));
        }

        return result;
      },
      [],
    );
  }

  private enableShortcuts(): void {
    this.toolsToBeDisplayed.forEach((tool: BlockToolAdapter) => {
      const shortcut = tool.shortcut;

      if (shortcut) {
        this.enableShortcutForTool(tool.name, shortcut);
      }
    });
  }

  private enableShortcutForTool(toolName: string, shortcut: string): void {
    Shortcuts.add({
      name: shortcut,
      on: this.api.ui.nodes.redactor,
      handler: async (event: KeyboardEvent) => {
        event.preventDefault();

        const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
        const currentBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);

        if (currentBlock) {
          try {
            const newBlock = await this.api.blocks.convert(
              currentBlock.id,
              toolName,
            );

            this.api.caret.setToBlock(newBlock, 'end');

            return;
          } catch (error) {}
        }

        this.insertNewBlock(toolName);
      },
    });
  }

  private removeAllShortcuts(): void {
    this.toolsToBeDisplayed.forEach((tool: BlockToolAdapter) => {
      const shortcut = tool.shortcut;

      if (shortcut) {
        Shortcuts.remove(this.api.ui.nodes.redactor, shortcut);
      }
    });
  }

  private async insertNewBlock(
    toolName: string,
    blockDataOverrides?: BlockToolData,
  ): Promise<void> {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
    const currentBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);

    if (!currentBlock) {
      return;
    }

    const index = currentBlock.isEmpty
      ? currentBlockIndex
      : currentBlockIndex + 1;

    let blockData;

    if (blockDataOverrides) {
      const defaultBlockData = await this.api.blocks.composeBlockData(toolName);

      blockData = Object.assign(defaultBlockData, blockDataOverrides);
    }

    const newBlock = this.api.blocks.insert(
      toolName,
      blockData,
      undefined,
      index,
      undefined,
      currentBlock.isEmpty,
    );

    newBlock.call(BlockToolAPI.APPEND_CALLBACK);

    this.api.caret.setToBlock(index);

    this.emit(ToolboxEvent.BlockAdded, {
      block: newBlock,
    });

    this.api.toolbar.close();
  }
}
