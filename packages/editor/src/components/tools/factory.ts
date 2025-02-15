import {
  InternalInlineToolSettings,
  InternalTuneSettings,
} from '@/components/tools/base';
import InlineToolAdapter from '@/components/tools/inline';
import BlockTuneAdapter from '@/components/tools/tune';
import BlockToolAdapter from '@/components/tools/block';
import ApiModule from '@/components/modules/api';

import type { EditorConfig } from '@/types/configs/editor-config';
import type { ToolConstructable } from '@/types/tools';
import type { ToolSettings } from '@/types/tools/tool-settings';

type ToolConstructor =
  | typeof InlineToolAdapter
  | typeof BlockToolAdapter
  | typeof BlockTuneAdapter;

export default class ToolsFactory {
  private config: { [name: string]: ToolSettings & { isInternal?: boolean } };

  private api: ApiModule;

  private editorConfig: EditorConfig;

  constructor(
    config: { [name: string]: ToolSettings & { isInternal?: boolean } },
    editorConfig: EditorConfig,
    api: ApiModule,
  ) {
    this.api = api;
    this.config = config;
    this.editorConfig = editorConfig;
  }

  public get(
    name: string,
  ): InlineToolAdapter | BlockToolAdapter | BlockTuneAdapter {
    const {
      class: constructable,
      isInternal = false,
      ...config
    } = this.config[name];

    const Constructor = this.getConstructor(constructable);
    const isTune = constructable[InternalTuneSettings.IsTune];

    return new Constructor({
      name,
      constructable,
      config,
      api: this.api.getMethodsForTool(name, isTune),
      isDefault: name === this.editorConfig.defaultBlock,
      defaultPlaceholder: this.editorConfig.placeholder,
      isInternal,
    });
  }

  private getConstructor(constructable: ToolConstructable): ToolConstructor {
    switch (true) {
      case constructable[InternalInlineToolSettings.IsInline]:
        return InlineToolAdapter;
      case constructable[InternalTuneSettings.IsTune]:
        return BlockTuneAdapter;
      default:
        return BlockToolAdapter;
    }
  }
}
