import Module from '@repo/editor/components/__module';
import Block from '@repo/editor/components/block';
import * as utilities from '@repo/editor/components/utilities';
import { sanitizeBlocks } from '@repo/editor/components/utils/sanitizer';

import type { OutputData } from '@repo/editor/types/data-formats/output-data';
import type {
  SavedData,
  ValidatedData,
} from '@repo/editor/types/data-formats/block-data';

export default class Saver extends Module {
  public async save(): Promise<OutputData> {
    const { BlockManager, Tools } = this.Editor;
    const blocks = BlockManager.blocks,
      chainData = [];

    try {
      blocks.forEach((block: Block) => {
        chainData.push(this.getSavedData(block));
      });

      const extractedData = (await Promise.all(chainData)) as Array<
        Pick<SavedData, 'data' | 'tool'>
      >;
      const sanitizedData = await sanitizeBlocks(extractedData, (name) => {
        return Tools.blockTools.get(name).sanitizeConfig;
      });

      return this.makeOutput(sanitizedData);
    } catch (e) {
      utilities.logLabeled(`Saving failed due to the Error %o`, 'error', e);
    }
  }

  private async getSavedData(block: Block): Promise<ValidatedData> {
    const blockData = await block.save();
    const isValid = blockData && (await block.validate(blockData.data));

    return {
      ...blockData,
      isValid,
    };
  }

  private makeOutput(allExtractedData): OutputData {
    const blocks = [];

    allExtractedData.forEach(({ id, tool, data, tunes, isValid }) => {
      if (!isValid) {
        utilities.log(`Block «${tool}» skipped because saved data is invalid`);

        return;
      }

      if (tool === this.Editor.Tools.stubTool) {
        blocks.push(data);

        return;
      }

      const output = {
        id,
        type: tool,
        data,
        ...(!utilities.isEmpty(tunes) && {
          tunes,
        }),
      };

      blocks.push(output);
    });

    return {
      blocks,
    };
  }
}
