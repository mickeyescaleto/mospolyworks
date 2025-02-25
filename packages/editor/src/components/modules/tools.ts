import Module from '@repo/editor/components/__module';
import * as utilities from '@repo/editor/components/utilities';
import Paragraph from '@repo/editor/tools/paragraph';
import Header from '@repo/editor/tools/header';
import Image from '@repo/editor/tools/image';
import BoldInlineTool from '@repo/editor/components/inline-tools/inline-tool-bold';
import ItalicInlineTool from '@repo/editor/components/inline-tools/inline-tool-italic';
import LinkInlineTool from '@repo/editor/components/inline-tools/inline-tool-link';
import ConvertInlineTool from '@repo/editor/components/inline-tools/inline-tool-convert';
import Stub from '@repo/editor/tools/stub';
import ToolsFactory from '@repo/editor/components/tools/factory';
import type InlineToolAdapter from '@repo/editor/components/tools/inline';
import type BlockToolAdapter from '@repo/editor/components/tools/block';
import type BlockTuneAdapter from '@repo/editor/components/tools/tune';
import MoveDownTune from '@repo/editor/components/block-tunes/block-tune-move-down';
import DeleteTune from '@repo/editor/components/block-tunes/block-tune-delete';
import MoveUpTune from '@repo/editor/components/block-tunes/block-tune-move-up';
import ToolsCollection from '@repo/editor/components/tools/collection';

import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';
import type { ToolConfig } from '@repo/editor/types/tools/tool-config';
import type { ToolConstructable } from '@repo/editor/types/tools';
import type { ToolSettings } from '@repo/editor/types/tools/tool-settings';

export default class Tools extends Module {
  public stubTool = 'stub';

  public get available(): ToolsCollection {
    return this.toolsAvailable;
  }

  public get unavailable(): ToolsCollection {
    return this.toolsUnavailable;
  }

  public get inlineTools(): ToolsCollection<InlineToolAdapter> {
    return this.available.inlineTools;
  }

  public get blockTools(): ToolsCollection<BlockToolAdapter> {
    return this.available.blockTools;
  }

  public get blockTunes(): ToolsCollection<BlockTuneAdapter> {
    return this.available.blockTunes;
  }

  public get defaultTool(): BlockToolAdapter {
    return this.blockTools.get(this.config.defaultBlock);
  }

  private factory: ToolsFactory;

  private readonly toolsAvailable: ToolsCollection = new ToolsCollection();

  private readonly toolsUnavailable: ToolsCollection = new ToolsCollection();

  public get internal(): ToolsCollection {
    return this.available.internalTools;
  }

  public async prepare(): Promise<void> {
    this.validateTools();

    this.config.tools = utilities.deepMerge(
      {},
      this.internalTools,
      this.config.tools,
    );

    if (
      !Object.prototype.hasOwnProperty.call(this.config, 'tools') ||
      Object.keys(this.config.tools).length === 0
    ) {
      throw Error("Can't start without tools");
    }

    const config = this.prepareConfig();

    this.factory = new ToolsFactory(config, this.config, this.Editor.API);

    const sequenceData = this.getListOfPrepareFunctions(config);

    if (sequenceData.length === 0) {
      return Promise.resolve();
    }

    await utilities.sequence(
      sequenceData,
      (data: { toolName: string }) => {
        this.toolPrepareMethodSuccess(data);
      },
      (data: { toolName: string }) => {
        this.toolPrepareMethodFallback(data);
      },
    );

    this.prepareBlockTools();
  }

  @utilities.cacheable
  public getAllInlineToolsSanitizeConfig(): SanitizerConfig {
    const config: SanitizerConfig = {} as SanitizerConfig;

    Array.from(this.inlineTools.values()).forEach((inlineTool) => {
      Object.assign(config, inlineTool.sanitizeConfig);
    });

    return config;
  }

  public destroy(): void {
    Object.values(this.available).forEach(async (tool) => {
      if (utilities.isFunction(tool.reset)) {
        await tool.reset();
      }
    });
  }

  private get internalTools(): {
    [toolName: string]:
      | ToolConstructable
      | (ToolSettings & { isInternal?: boolean });
  } {
    return {
      convertTo: {
        class: ConvertInlineTool,
        isInternal: true,
      },
      link: {
        class: LinkInlineTool,
        isInternal: true,
      },
      bold: {
        class: BoldInlineTool,
        isInternal: true,
      },
      italic: {
        class: ItalicInlineTool,
        isInternal: true,
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        isInternal: true,
        config: {
          placeholder: 'Текст',
        },
      },
      header: {
        class: Header,
        isInternal: true,
        inlineToolbar: ['link', 'italic'],
        config: {
          placeholder: 'Заголовок',
          levels: [2, 3, 4],
          defaultLevel: 2,
        },
      },
      image: {
        class: Image,
        isInternal: true,
        config: {
          endpoints: {
            byFile: 'http://localhost:3001/upload-by-file',
            byUrl: 'http://localhost:3001/upload-by-url',
          },
        },
      },
      stub: {
        class: Stub,
        isInternal: true,
      },
      moveUp: {
        class: MoveUpTune,
        isInternal: true,
      },
      delete: {
        class: DeleteTune,
        isInternal: true,
      },
      moveDown: {
        class: MoveDownTune,
        isInternal: true,
      },
    };
  }

  private toolPrepareMethodSuccess(data: { toolName: string }): void {
    const tool = this.factory.get(data.toolName);

    if (tool.isInline()) {
      const inlineToolRequiredMethods = ['render'];
      const notImplementedMethods = inlineToolRequiredMethods.filter(
        (method) => !tool.create()[method],
      );

      if (notImplementedMethods.length) {
        utilities.log(
          `Incorrect Inline Tool: ${tool.name}. Some of required methods is not implemented %o`,
          'warn',
          notImplementedMethods,
        );

        this.toolsUnavailable.set(tool.name, tool);

        return;
      }
    }

    this.toolsAvailable.set(tool.name, tool);
  }

  private toolPrepareMethodFallback(data: { toolName: string }): void {
    this.toolsUnavailable.set(data.toolName, this.factory.get(data.toolName));
  }

  private getListOfPrepareFunctions(config: { [name: string]: ToolSettings }): {
    function: (data: {
      toolName: string;
      config: ToolConfig;
    }) => void | Promise<void>;
    data: { toolName: string; config: ToolConfig };
  }[] {
    const toolPreparationList: {
      function: (data: { toolName: string }) => void | Promise<void>;
      data: { toolName: string; config: ToolConfig };
    }[] = [];

    Object.entries(config).forEach(([toolName, settings]) => {
      toolPreparationList.push({
        function: utilities.isFunction(settings.class.prepare)
          ? settings.class.prepare
          : (): void => {},
        data: {
          toolName,
          config: settings.config,
        },
      });
    });

    return toolPreparationList;
  }

  private prepareBlockTools(): void {
    Array.from(this.blockTools.values()).forEach((tool) => {
      this.assignInlineToolsToBlockTool(tool);
      this.assignBlockTunesToBlockTool(tool);
    });
  }

  private assignInlineToolsToBlockTool(tool: BlockToolAdapter): void {
    if (this.config.inlineToolbar === false) {
      return;
    }

    if (tool.enabledInlineTools === true) {
      tool.inlineTools = new ToolsCollection<InlineToolAdapter>(
        Array.isArray(this.config.inlineToolbar)
          ? this.config.inlineToolbar.map((name) => [
              name,
              this.inlineTools.get(name),
            ])
          : Array.from(this.inlineTools.entries()),
      );

      return;
    }

    if (Array.isArray(tool.enabledInlineTools)) {
      tool.inlineTools = new ToolsCollection<InlineToolAdapter>(
        ['convertTo', ...tool.enabledInlineTools].map((name) => [
          name,
          this.inlineTools.get(name),
        ]),
      );
    }
  }

  private assignBlockTunesToBlockTool(tool: BlockToolAdapter): void {
    if (tool.enabledBlockTunes === false) {
      return;
    }

    if (Array.isArray(tool.enabledBlockTunes)) {
      const userTunes = new ToolsCollection<BlockTuneAdapter>(
        tool.enabledBlockTunes.map((name) => [name, this.blockTunes.get(name)]),
      );

      tool.tunes = new ToolsCollection<BlockTuneAdapter>([
        ...userTunes,
        ...this.blockTunes.internalTools,
      ]);

      return;
    }

    if (Array.isArray(this.config.tunes)) {
      const userTunes = new ToolsCollection<BlockTuneAdapter>(
        this.config.tunes.map((name) => [name, this.blockTunes.get(name)]),
      );

      tool.tunes = new ToolsCollection<BlockTuneAdapter>([
        ...userTunes,
        ...this.blockTunes.internalTools,
      ]);

      return;
    }

    tool.tunes = this.blockTunes.internalTools;
  }

  private validateTools(): void {
    for (const toolName in this.config.tools) {
      if (Object.prototype.hasOwnProperty.call(this.config.tools, toolName)) {
        if (toolName in this.internalTools) {
          return;
        }

        const tool = this.config.tools[toolName];

        if (
          !utilities.isFunction(tool) &&
          !utilities.isFunction((tool as ToolSettings).class)
        ) {
          throw Error(
            `Tool «${toolName}» must be a constructor function or an object with function in the «class» property`,
          );
        }
      }
    }
  }

  private prepareConfig(): { [name: string]: ToolSettings } {
    const config: { [name: string]: ToolSettings } = {};

    for (const toolName in this.config.tools) {
      if (utilities.isObject(this.config.tools[toolName])) {
        config[toolName] = this.config.tools[toolName] as ToolSettings;
      } else {
        config[toolName] = {
          class: this.config.tools[toolName] as ToolConstructable,
        };
      }
    }

    return config;
  }
}
