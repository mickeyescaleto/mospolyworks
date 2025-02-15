import HTMLJanitor from 'html-janitor';
import * as utilities from '@/components/utilities';

import type { SavedData } from '@/types/data-formats/block-data';
import type { SanitizerConfig } from '@/types/configs/sanitizer-config';
import type { BlockToolData } from '@/types/tools/block-tool-data';

export function sanitizeBlocks(
  blocksData: Array<Pick<SavedData, 'data' | 'tool'>>,
  sanitizeConfig: SanitizerConfig | ((toolName: string) => SanitizerConfig),
): Array<Pick<SavedData, 'data' | 'tool'>> {
  return blocksData.map((block) => {
    const toolConfig = utilities.isFunction(sanitizeConfig)
      ? sanitizeConfig(block.tool)
      : sanitizeConfig;

    if (utilities.isEmpty(toolConfig)) {
      return block;
    }

    block.data = deepSanitize(block.data, toolConfig) as BlockToolData;

    return block;
  });
}

export function clean(
  taintString: string,
  customConfig: SanitizerConfig = {} as SanitizerConfig,
): string {
  const sanitizerConfig = {
    tags: customConfig,
  };

  const sanitizerInstance = new HTMLJanitor(sanitizerConfig);

  return sanitizerInstance.clean(taintString);
}

function deepSanitize(
  dataToSanitize: object | string,
  rules: SanitizerConfig,
): object | string {
  if (Array.isArray(dataToSanitize)) {
    return cleanArray(dataToSanitize, rules);
  } else if (utilities.isObject(dataToSanitize)) {
    return cleanObject(dataToSanitize, rules);
  } else {
    if (utilities.isString(dataToSanitize)) {
      return cleanOneItem(dataToSanitize, rules);
    }

    return dataToSanitize;
  }
}

function cleanArray(
  array: Array<object | string>,
  ruleForItem: SanitizerConfig,
): Array<object | string> {
  return array.map((arrayItem) => deepSanitize(arrayItem, ruleForItem));
}

function cleanObject(
  object: object,
  rules: SanitizerConfig | { [field: string]: SanitizerConfig },
): object {
  const cleanData = {};

  for (const fieldName in object) {
    if (!Object.prototype.hasOwnProperty.call(object, fieldName)) {
      continue;
    }

    const currentIterationItem = object[fieldName];

    const ruleForItem = isRule(rules[fieldName] as SanitizerConfig)
      ? rules[fieldName]
      : rules;

    cleanData[fieldName] = deepSanitize(
      currentIterationItem,
      ruleForItem as SanitizerConfig,
    );
  }

  return cleanData;
}

function cleanOneItem(
  taintString: string,
  rule: SanitizerConfig | boolean,
): string {
  if (utilities.isObject(rule)) {
    return clean(taintString, rule);
  } else if (rule === false) {
    return clean(taintString, {} as SanitizerConfig);
  } else {
    return taintString;
  }
}

function isRule(config: SanitizerConfig): boolean {
  return (
    utilities.isObject(config) ||
    utilities.isBoolean(config) ||
    utilities.isFunction(config)
  );
}
