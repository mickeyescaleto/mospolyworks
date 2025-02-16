import type { BlockAPI } from '@repo/editor/types/api/block';

export type Caret = {
  setToFirstBlock(
    position?: 'end' | 'start' | 'default',
    offset?: number,
  ): boolean;
  setToLastBlock(
    position?: 'end' | 'start' | 'default',
    offset?: number,
  ): boolean;
  setToPreviousBlock(
    position?: 'end' | 'start' | 'default',
    offset?: number,
  ): boolean;
  setToNextBlock(
    position?: 'end' | 'start' | 'default',
    offset?: number,
  ): boolean;
  setToBlock(
    blockOrIdOrIndex: BlockAPI | BlockAPI['id'] | number,
    position?: 'end' | 'start' | 'default',
    offset?: number,
  ): boolean;
  focus(atEnd?: boolean): boolean;
};
