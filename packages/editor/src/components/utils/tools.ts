import { isFunction, isString } from '@repo/editor/components/utilities';
import BlockToolAdapter from '@repo/editor/components/tools/block';

export function isToolConvertable(
  tool: BlockToolAdapter,
  direction: 'export' | 'import',
): boolean {
  if (!tool.conversionConfig) {
    return false;
  }

  const conversionProp = tool.conversionConfig[direction];

  return isFunction(conversionProp) || isString(conversionProp);
}
