import { IconReplace } from '@codexteam/icons';
import Dom from '@repo/editor/components/dom';
import Module from '@repo/editor/components/__module';
import SelectionUtils from '@repo/editor/components/selection';
import Block from '@repo/editor/components/block';
import I18n from '@repo/editor/components/i18n';
import { I18nInternalNS } from '@repo/editor/components/i18n/namespace-internal';
import Flipper from '@repo/editor/components/flipper';
import { resolveAliases } from '@repo/editor/components/utils/resolve-aliases';
import {
  type Popover,
  PopoverDesktop,
  PopoverMobile,
} from '@repo/editor/components/utils/popover';
import { isMobileScreen } from '@repo/editor/components/utilities';
import { EditorMobileLayoutToggled } from '@repo/editor/components/events';
import { getConvertibleToolsForBlock } from '@repo/editor/components/utils/blocks';
import { PopoverEvent } from '@repo/editor/types/utils/popover/popover-event';
import { PopoverItemType } from '@repo/editor/types/utils/popover/popover-item-type';

import type { MenuConfigItem } from '@repo/editor/types/tools/menu-config';
import type { PopoverItemParams } from '@repo/editor/types/utils/popover/popover-item';

type BlockSettingsNodes = {
  wrapper: HTMLElement | undefined;
};

export default class BlockSettings extends Module<BlockSettingsNodes> {
  public get events(): { opened: string; closed: string } {
    return {
      opened: 'block-settings-opened',
      closed: 'block-settings-closed',
    };
  }

  public get CSS(): { [name: string]: string } {
    return {
      settings: 'editor-settings',
    };
  }

  public opened = false;

  public get flipper(): Flipper | undefined {
    if (this.popover === null) {
      return;
    }

    return 'flipper' in this.popover ? this.popover?.flipper : undefined;
  }

  private selection: SelectionUtils = new SelectionUtils();

  private popover: Popover | null = null;

  public make(): void {
    this.nodes.wrapper = Dom.make('div', [this.CSS.settings]);

    this.eventsDispatcher.on(EditorMobileLayoutToggled, this.close);
  }

  public destroy(): void {
    this.removeAllNodes();
    this.listeners.destroy();
    this.eventsDispatcher.off(EditorMobileLayoutToggled, this.close);
  }

  public async open(
    targetBlock: Block = this.Editor.BlockManager.currentBlock,
  ): Promise<void> {
    this.opened = true;

    this.selection.save();

    this.Editor.BlockSelection.selectBlock(targetBlock);
    this.Editor.BlockSelection.clearCache();

    const { toolTunes, commonTunes } = targetBlock.getTunes();

    this.eventsDispatcher.emit(this.events.opened);

    const PopoverClass = isMobileScreen() ? PopoverMobile : PopoverDesktop;

    this.popover = new PopoverClass({
      searchable: true,
      items: await this.getTunesItems(targetBlock, commonTunes, toolTunes),
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: I18n.ui(I18nInternalNS.ui.popover, 'Nothing found'),
        search: I18n.ui(I18nInternalNS.ui.popover, 'Filter'),
      },
    });

    this.popover.on(PopoverEvent.Closed, this.onPopoverClose);

    this.nodes.wrapper?.append(this.popover.getElement());

    this.popover.show();
  }

  public getElement(): HTMLElement | undefined {
    return this.nodes.wrapper;
  }

  public close = (): void => {
    if (!this.opened) {
      return;
    }

    this.opened = false;

    if (!SelectionUtils.isAtEditor) {
      this.selection.restore();
    }

    this.selection.clearSaved();

    if (
      !this.Editor.CrossBlockSelection.isCrossBlockSelectionStarted &&
      this.Editor.BlockManager.currentBlock
    ) {
      this.Editor.BlockSelection.unselectBlock(
        this.Editor.BlockManager.currentBlock,
      );
    }

    this.eventsDispatcher.emit(this.events.closed);

    if (this.popover) {
      this.popover.off(PopoverEvent.Closed, this.onPopoverClose);
      this.popover.destroy();
      this.popover.getElement().remove();
      this.popover = null;
    }
  };

  private async getTunesItems(
    currentBlock: Block,
    commonTunes: MenuConfigItem[],
    toolTunes?: MenuConfigItem[],
  ): Promise<PopoverItemParams[]> {
    const items = [] as MenuConfigItem[];

    if (toolTunes !== undefined && toolTunes.length > 0) {
      items.push(...toolTunes);
      items.push({
        type: PopoverItemType.Separator,
      });
    }

    const allBlockTools = Array.from(this.Editor.Tools.blockTools.values());
    const convertibleTools = await getConvertibleToolsForBlock(
      currentBlock,
      allBlockTools,
    );
    const convertToItems = convertibleTools.reduce((result, tool) => {
      tool.toolbox.forEach((toolboxItem) => {
        result.push({
          icon: toolboxItem.icon,
          title: I18n.t(I18nInternalNS.toolNames, toolboxItem.title),
          name: tool.name,
          closeOnActivate: true,
          onActivate: async () => {
            const { BlockManager, Caret, Toolbar } = this.Editor;

            const newBlock = await BlockManager.convert(
              currentBlock,
              tool.name,
              toolboxItem.data,
            );

            Toolbar.close();

            Caret.setToBlock(newBlock, Caret.positions.END);
          },
        });
      });

      return result;
    }, []);

    if (convertToItems.length > 0) {
      items.push({
        icon: IconReplace,
        name: 'convert-to',
        title: I18n.ui(I18nInternalNS.ui.popover, 'Convert to'),
        children: {
          searchable: true,
          items: convertToItems,
        },
      });
      items.push({
        type: PopoverItemType.Separator,
      });
    }

    items.push(...commonTunes);

    return items.map((tune) => this.resolveTuneAliases(tune));
  }

  private onPopoverClose = (): void => {
    this.close();
  };

  private resolveTuneAliases(item: MenuConfigItem): PopoverItemParams {
    if (
      item.type === PopoverItemType.Separator ||
      item.type === PopoverItemType.Html
    ) {
      return item;
    }
    const result = resolveAliases(item, { label: 'title' });

    if (item.confirmation) {
      result.confirmation = this.resolveTuneAliases(item.confirmation);
    }

    return result;
  }
}
