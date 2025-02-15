import {
  isFunction,
  isString,
  log,
  equals,
  isEmpty,
} from '@/components/utilities';
import Block from '@/components/block';
import BlockToolAdapter from '@/components/tools/block';
import { isToolConvertable } from '@/components/utils/tools';

import type { SavedData } from '@/types/data-formats/block-data';
import type { BlockAPI } from '@/types/api/block';
import type { ToolConfig } from '@/types/tools/tool-config';
import type { ConversionConfig } from '@/types/configs/conversion-config';
import type { BlockToolData } from '@/types/tools/block-tool-data';

export function isBlockConvertable(
  block: Block,
  direction: 'export' | 'import',
): boolean {
  return isToolConvertable(block.tool, direction);
}

export function isSameBlockData(
  data1: BlockToolData,
  data2: BlockToolData,
): boolean {
  return Object.entries(data1).some(([propName, propValue]) => {
    return data2[propName] && equals(data2[propName], propValue);
  });
}

export async function getConvertibleToolsForBlock(
  block: BlockAPI,
  allBlockTools: BlockToolAdapter[],
): Promise<BlockToolAdapter[]> {
  const savedData = (await block.save()) as SavedData;
  const blockData = savedData.data;

  const blockTool = allBlockTools.find((tool) => tool.name === block.name);

  if (blockTool !== undefined && !isToolConvertable(blockTool, 'export')) {
    return [];
  }

  return allBlockTools.reduce((result, tool) => {
    if (!isToolConvertable(tool, 'import')) {
      return result;
    }

    if (tool.toolbox === undefined) {
      return result;
    }

    const actualToolboxItems = tool.toolbox.filter((toolboxItem) => {
      if (isEmpty(toolboxItem) || toolboxItem.icon === undefined) {
        return false;
      }

      if (toolboxItem.data !== undefined) {
        if (isSameBlockData(toolboxItem.data, blockData)) {
          return false;
        }
      } else if (tool.name === block.name) {
        return false;
      }

      return true;
    });

    result.push({
      ...tool,
      toolbox: actualToolboxItems,
    } as BlockToolAdapter);

    return result;
  }, [] as BlockToolAdapter[]);
}

export function areBlocksMergeable(
  targetBlock: Block,
  blockToMerge: Block,
): boolean {
  if (!targetBlock.mergeable) {
    return false;
  }

  if (targetBlock.name === blockToMerge.name) {
    return true;
  }

  return (
    isBlockConvertable(blockToMerge, 'export') &&
    isBlockConvertable(targetBlock, 'import')
  );
}

export function convertBlockDataToString(
  blockData: BlockToolData,
  conversionConfig?: ConversionConfig,
): string {
  const exportProp = conversionConfig?.export;

  if (isFunction(exportProp)) {
    return exportProp(blockData);
  } else if (isString(exportProp)) {
    return blockData[exportProp];
  } else {
    if (exportProp !== undefined) {
      log(
        'Conversion «export» property must be a string or function. ' +
          'String means key of saved data object to export. Function should export processed string to export.',
      );
    }

    return '';
  }
}

export function convertStringToBlockData(
  stringToImport: string,
  conversionConfig?: ConversionConfig,
  targetToolConfig?: ToolConfig,
): BlockToolData {
  const importProp = conversionConfig?.import;

  if (isFunction(importProp)) {
    return importProp(stringToImport, targetToolConfig);
  } else if (isString(importProp)) {
    return {
      [importProp]: stringToImport,
    };
  } else {
    if (importProp !== undefined) {
      log(
        'Conversion «import» property must be a string or function. ' +
          'String means key of tool data to import. Function accepts a imported string and return composed tool data.',
      );
    }

    return {};
  }
}
