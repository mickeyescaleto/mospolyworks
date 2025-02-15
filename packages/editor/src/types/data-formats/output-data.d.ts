import type { BlockToolData } from '@/types/tools/block-tool-data';
import type { BlockTuneData } from '@/types/block-tunes/block-tune-data';
import type { BlockId } from '@/types/data-formats/block-id';

export type OutputBlockData<
  Type extends string = string,
  Data extends object = any,
> = {
  id?: BlockId;
  type: Type;
  data: BlockToolData<Data>;
  tunes?: { [name: string]: BlockTuneData };
};

export type OutputData = {
  blocks: OutputBlockData[];
};
