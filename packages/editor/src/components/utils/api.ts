import Block from '@repo/editor/components/block';

import type { EditorModules } from '@repo/editor/types-internal/editor-modules';
import type { BlockAPI } from '@repo/editor/types/api/block';

export function resolveBlock(
  attribute: BlockAPI | BlockAPI['id'] | number,
  editor: EditorModules,
): Block | undefined {
  if (typeof attribute === 'number') {
    return editor.BlockManager.getBlockByIndex(attribute);
  }

  if (typeof attribute === 'string') {
    return editor.BlockManager.getBlockById(attribute);
  }

  return editor.BlockManager.getBlockById(attribute.id);
}
