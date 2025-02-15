import * as utilities from '@/components/utilities';
import { ToolType } from '@/types/tools/adapters/tool-type';

import type { BaseToolAdapter as BaseToolAdapterInterface } from '@/types/tools/adapters/base-tool-adapter';
import type { InlineToolAdapter as InlineToolAdapterInterface } from '@/types/tools/adapters/inline-tool-adapter';
import type { BlockToolAdapter as BlockToolAdapterInterface } from '@/types/tools/adapters/block-tool-adapter';
import type { BlockTuneAdapter as BlockTuneAdapterInterface } from '@/types/tools/adapters/block-tune-adapter';
import type { API as ApiMethods } from '@/types';
import type { SanitizerConfig } from '@/types/configs/sanitizer-config';
import type { ToolSettings } from '@/types/tools/tool-settings';
import type { Tool, ToolConstructable } from '@/types/tools';

export enum UserSettings {
  Shortcut = 'shortcut',
  Toolbox = 'toolbox',
  EnabledInlineTools = 'inlineToolbar',
  EnabledBlockTunes = 'tunes',
  Config = 'config',
}

export enum CommonInternalSettings {
  Shortcut = 'shortcut',
  SanitizeConfig = 'sanitize',
}

export enum InternalBlockToolSettings {
  IsEnabledLineBreaks = 'enableLineBreaks',
  Toolbox = 'toolbox',
  ConversionConfig = 'conversionConfig',
  IsReadOnlySupported = 'isReadOnlySupported',
  PasteConfig = 'pasteConfig',
}

export enum InternalInlineToolSettings {
  IsInline = 'isInline',
  Title = 'title',
  IsReadOnlySupported = 'isReadOnlySupported',
}

export enum InternalTuneSettings {
  IsTune = 'isTune',
}

export type ToolOptions = Omit<ToolSettings, 'class'>;

type ConstructorOptions = {
  name: string;
  constructable: ToolConstructable;
  config: ToolOptions;
  api: ApiMethods;
  isDefault: boolean;
  isInternal: boolean;
  defaultPlaceholder?: string | false;
};

export default abstract class BaseToolAdapter<
  Type extends ToolType = ToolType,
  ToolClass extends Tool = Tool,
> implements BaseToolAdapterInterface<ToolType, Tool>
{
  public type: Type;

  public name: string;

  public readonly isInternal: boolean;

  public readonly isDefault: boolean;

  protected api: ApiMethods;

  protected config: ToolOptions;

  protected constructable: ToolConstructable;

  protected defaultPlaceholder?: string | false;

  constructor({
    name,
    constructable,
    config,
    api,
    isDefault,
    isInternal = false,
    defaultPlaceholder,
  }: ConstructorOptions) {
    this.api = api;
    this.name = name;
    this.constructable = constructable;
    this.config = config;
    this.isDefault = isDefault;
    this.isInternal = isInternal;
    this.defaultPlaceholder = defaultPlaceholder;
  }

  public get settings(): ToolOptions {
    const config = this.config[UserSettings.Config] || {};

    if (
      this.isDefault &&
      !('placeholder' in config) &&
      this.defaultPlaceholder
    ) {
      config.placeholder = this.defaultPlaceholder;
    }

    return config;
  }

  public reset(): void | Promise<void> {
    if (utilities.isFunction(this.constructable.reset)) {
      return this.constructable.reset();
    }
  }

  public prepare(): void | Promise<void> {
    if (utilities.isFunction(this.constructable.prepare)) {
      return this.constructable.prepare({
        toolName: this.name,
        config: this.settings,
      });
    }
  }

  public get shortcut(): string | undefined {
    const toolShortcut = this.constructable[CommonInternalSettings.Shortcut];
    const userShortcut = this.config[UserSettings.Shortcut];

    return userShortcut || toolShortcut;
  }

  public get sanitizeConfig(): SanitizerConfig {
    return this.constructable[CommonInternalSettings.SanitizeConfig] || {};
  }

  public isInline(): this is InlineToolAdapterInterface {
    return this.type === ToolType.Inline;
  }

  public isBlock(): this is BlockToolAdapterInterface {
    return this.type === ToolType.Block;
  }

  public isTune(): this is BlockTuneAdapterInterface {
    return this.type === ToolType.Tune;
  }

  public abstract create(...args: any[]): ToolClass;
}
