import * as utilities from '@/components/utilities';
import InlineToolAdapter from '@/components/tools/inline';
import BlockTuneAdapter from '@/components/tools/tune';
import ToolsCollection from '@/components/tools/collection';
import BaseToolAdapter, {
  InternalBlockToolSettings,
  UserSettings,
} from '@/components/tools/base';
import { ToolType } from '@/types/tools/adapters/tool-type';

import type { BlockToolAdapter as BlockToolAdapterInterface } from '@/types/tools/adapters/block-tool-adapter';
import type { BlockAPI } from '@/types/api/block';
import type {
  BlockTool as IBlockTool,
  BlockToolConstructable,
} from '@/types/tools/block-tool';
import type { BlockToolData } from '@/types/tools/block-tool-data';
import type { ConversionConfig } from '@/types/configs/conversion-config';
import type { PasteConfig } from '@/types/configs/paste-config';
import type { SanitizerConfig } from '@/types/configs/sanitizer-config';
import type { ToolboxConfig } from '@/types/tools/tool-settings';
import type { ToolboxConfigEntry } from '@/types/tools/tool-settings';

export default class BlockToolAdapter
  extends BaseToolAdapter<ToolType.Block, IBlockTool>
  implements BlockToolAdapterInterface
{
  public type: ToolType.Block = ToolType.Block;

  public inlineTools: ToolsCollection<InlineToolAdapter> =
    new ToolsCollection<InlineToolAdapter>();

  public tunes: ToolsCollection<BlockTuneAdapter> =
    new ToolsCollection<BlockTuneAdapter>();

  protected constructable: BlockToolConstructable;

  public create(
    data: BlockToolData,
    block: BlockAPI,
    readOnly: boolean,
  ): IBlockTool {
    return new this.constructable({
      data,
      block,
      readOnly,
      api: this.api,
      config: this.settings,
    }) as IBlockTool;
  }

  public get isReadOnlySupported(): boolean {
    return (
      this.constructable[InternalBlockToolSettings.IsReadOnlySupported] === true
    );
  }

  public get isLineBreaksEnabled(): boolean {
    return this.constructable[InternalBlockToolSettings.IsEnabledLineBreaks];
  }

  public get toolbox(): ToolboxConfigEntry[] | undefined {
    const toolToolboxSettings = this.constructable[
      InternalBlockToolSettings.Toolbox
    ] as ToolboxConfig;
    const userToolboxSettings = this.config[UserSettings.Toolbox];

    if (utilities.isEmpty(toolToolboxSettings)) {
      return;
    }
    if (userToolboxSettings === false) {
      return;
    }
    if (!userToolboxSettings) {
      return Array.isArray(toolToolboxSettings)
        ? toolToolboxSettings
        : [toolToolboxSettings];
    }

    if (Array.isArray(toolToolboxSettings)) {
      if (Array.isArray(userToolboxSettings)) {
        return userToolboxSettings.map((item, i) => {
          const toolToolboxEntry = toolToolboxSettings[i];

          if (toolToolboxEntry) {
            return {
              ...toolToolboxEntry,
              ...item,
            };
          }

          return item;
        });
      }

      return [userToolboxSettings];
    } else {
      if (Array.isArray(userToolboxSettings)) {
        return userToolboxSettings;
      }

      return [
        {
          ...toolToolboxSettings,
          ...userToolboxSettings,
        },
      ];
    }
  }

  public get conversionConfig(): ConversionConfig | undefined {
    return this.constructable[InternalBlockToolSettings.ConversionConfig];
  }

  public get enabledInlineTools(): boolean | string[] {
    return this.config[UserSettings.EnabledInlineTools] || false;
  }

  public get enabledBlockTunes(): boolean | string[] {
    return this.config[UserSettings.EnabledBlockTunes];
  }

  public get pasteConfig(): PasteConfig {
    return this.constructable[InternalBlockToolSettings.PasteConfig] ?? {};
  }

  @utilities.cacheable
  public get sanitizeConfig(): SanitizerConfig {
    const toolRules = super.sanitizeConfig;
    const baseConfig = this.baseSanitizeConfig;

    if (utilities.isEmpty(toolRules)) {
      return baseConfig;
    }

    const toolConfig = {} as SanitizerConfig;

    for (const fieldName in toolRules) {
      if (Object.prototype.hasOwnProperty.call(toolRules, fieldName)) {
        const rule = toolRules[fieldName];

        if (utilities.isObject(rule)) {
          toolConfig[fieldName] = Object.assign({}, baseConfig, rule);
        } else {
          toolConfig[fieldName] = rule;
        }
      }
    }

    return toolConfig;
  }

  @utilities.cacheable
  public get baseSanitizeConfig(): SanitizerConfig {
    const baseConfig = {};

    Array.from(this.inlineTools.values()).forEach((tool) =>
      Object.assign(baseConfig, tool.sanitizeConfig),
    );

    Array.from(this.tunes.values()).forEach((tune) =>
      Object.assign(baseConfig, tune.sanitizeConfig),
    );

    return baseConfig;
  }
}
