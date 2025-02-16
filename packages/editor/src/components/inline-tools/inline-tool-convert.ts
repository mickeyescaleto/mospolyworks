import { IconReplace } from '@codexteam/icons';
import * as utilities from '@repo/editor/components/utilities';
import SelectionUtils from '@repo/editor/components/selection';
import { getConvertibleToolsForBlock } from '@repo/editor/components/utils/blocks';
import I18nInternal from '@repo/editor/components/i18n';
import { I18nInternalNS } from '@repo/editor/components/i18n/namespace-internal';

import type { Blocks } from '@repo/editor/types/api/blocks';
import type { Selection } from '@repo/editor/types/api/selection';
import type { Tools } from '@repo/editor/types/api/tools';
import type { Caret } from '@repo/editor/types/api/caret';
import type { I18n } from '@repo/editor/types/api/i18n';
import type {
  MenuConfig,
  MenuConfigItem,
} from '@repo/editor/types/tools/menu-config';
import type { API } from '@repo/editor/types';
import type { InlineTool } from '@repo/editor/types/tools/inline-tool';

export default class ConvertInlineTool implements InlineTool {
  public static isInline = true;

  private readonly blocksAPI: Blocks;

  private readonly selectionAPI: Selection;

  private readonly toolsAPI: Tools;

  private readonly i18nAPI: I18n;

  private readonly caretAPI: Caret;

  constructor({ api }: { api: API }) {
    this.i18nAPI = api.i18n;
    this.blocksAPI = api.blocks;
    this.selectionAPI = api.selection;
    this.toolsAPI = api.tools;
    this.caretAPI = api.caret;
  }

  public async render(): Promise<MenuConfig> {
    const currentSelection = SelectionUtils.get();
    const currentBlock = this.blocksAPI.getBlockByElement(
      currentSelection.anchorNode as HTMLElement,
    );

    if (currentBlock === undefined) {
      return [];
    }

    const allBlockTools = this.toolsAPI.getBlockTools();
    const convertibleTools = await getConvertibleToolsForBlock(
      currentBlock,
      allBlockTools,
    );

    if (convertibleTools.length === 0) {
      return [];
    }

    const convertToItems = convertibleTools.reduce<MenuConfigItem[]>(
      (result, tool) => {
        tool.toolbox?.forEach((toolboxItem) => {
          result.push({
            icon: toolboxItem.icon,
            title: I18nInternal.t(I18nInternalNS.toolNames, toolboxItem.title),
            name: tool.name,
            closeOnActivate: true,
            onActivate: async () => {
              const newBlock = await this.blocksAPI.convert(
                currentBlock.id,
                tool.name,
                toolboxItem.data,
              );

              this.caretAPI.setToBlock(newBlock, 'end');
            },
          });
        });

        return result;
      },
      [],
    );

    const currentBlockToolboxItem = await currentBlock.getActiveToolboxEntry();
    const icon =
      currentBlockToolboxItem !== undefined
        ? currentBlockToolboxItem.icon
        : IconReplace;
    const isDesktop = !utilities.isMobileScreen();

    return {
      icon,
      name: 'convert-to',
      hint: {
        title: this.i18nAPI.t('Convert to'),
      },
      children: {
        searchable: isDesktop,
        items: convertToItems,
        onOpen: () => {
          if (isDesktop) {
            this.selectionAPI.setFakeBackground();
            this.selectionAPI.save();
          }
        },
        onClose: () => {
          if (isDesktop) {
            this.selectionAPI.restore();
            this.selectionAPI.removeFakeBackground();
          }
        },
      },
    };
  }
}
