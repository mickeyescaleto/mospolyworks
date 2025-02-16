import Module from '@repo/editor/components/__module';
import * as utilities from '@repo/editor/components/utilities';
import BlockToolAdapter from '@repo/editor/components/tools/block';
import type { StubData } from '@repo/editor/tools/stub';
import Block from '@repo/editor/components/block';

import type { BlockId } from '@repo/editor/types/data-formats/block-id';
import type { OutputBlockData } from '@repo/editor/types/data-formats/output-data';
import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';

export default class Renderer extends Module {
  public async render(blocksData: OutputBlockData[]): Promise<void> {
    return new Promise((resolve) => {
      const { Tools, BlockManager } = this.Editor;

      if (blocksData.length === 0) {
        BlockManager.insert();
      } else {
        const blocks = blocksData.map(({ type: tool, data, tunes, id }) => {
          if (Tools.available.has(tool) === false) {
            utilities.logLabeled(
              `Tool «${tool}» is not found. Check 'tools' property at the Editor.js config.`,
              'warn',
            );

            data = this.composeStubDataForTool(tool, data, id);
            tool = Tools.stubTool;
          }

          let block: Block;

          try {
            block = BlockManager.composeBlock({
              id,
              tool,
              data,
              tunes,
            });
          } catch (error) {
            utilities.log(
              `Block «${tool}» skipped because of plugins error`,
              'error',
              {
                data,
                error,
              },
            );

            data = this.composeStubDataForTool(tool, data, id);
            tool = Tools.stubTool;

            block = BlockManager.composeBlock({
              id,
              tool,
              data,
              tunes,
            });
          }

          return block;
        });

        BlockManager.insertMany(blocks);
      }

      window.requestIdleCallback(
        () => {
          resolve();
        },
        { timeout: 2000 },
      );
    });
  }

  private composeStubDataForTool(
    tool: string,
    data: BlockToolData,
    id?: BlockId,
  ): StubData {
    const { Tools } = this.Editor;

    let title = tool;

    if (Tools.unavailable.has(tool)) {
      const toolboxSettings = (Tools.unavailable.get(tool) as BlockToolAdapter)
        .toolbox;

      if (
        toolboxSettings !== undefined &&
        toolboxSettings[0].title !== undefined
      ) {
        title = toolboxSettings[0].title;
      }
    }

    return {
      savedData: {
        id,
        type: tool,
        data,
      },
      title,
    };
  }
}
