import type { BlockToolData } from '@/types/tools/block-tool-data';
import type { BlockId } from '@/types/data-formats/block-id';

export type SavedData = {
  id: BlockId;
  tool: string;
  data: BlockToolData;
  time: number;
};

export type ValidatedData = {
  id?: BlockId;
  tool?: string;
  data?: BlockToolData;
  time?: number;
  isValid: boolean;
};
