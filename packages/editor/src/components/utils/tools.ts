import { isFunction, isString } from '@/components/utilities';
import BlockToolAdapter from '@/components/tools/block';

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
