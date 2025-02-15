import type {
  OutputBlockData,
  OutputData,
} from '@/types/data-formats/output-data';
import type { BlockToolData } from '@/types/tools/block-tool-data';
import type { ToolConfig } from '@/types/tools/tool-config';
import type { BlockAPI } from '@/types/api/block';
import type { BlockTuneData } from '@/types/block-tunes/block-tune-data';

export type Blocks = {
  clear(): Promise<void>;
  render(data: OutputData): Promise<void>;
  renderFromHTML(data: string): Promise<void>;
  delete(index?: number): void;
  swap(fromIndex: number, toIndex: number): void;
  move(toIndex: number, fromIndex?: number): void;
  getBlockByIndex(index: number): BlockAPI | undefined;
  getById(id: string): BlockAPI | null;
  getCurrentBlockIndex(): number;
  getBlockIndex(blockId: string): number;
  getBlockByElement(element: HTMLElement): BlockAPI | undefined;
  stretchBlock(index: number, status?: boolean): void;
  getBlocksCount(): number;
  insertNewBlock(): void;
  insert(
    type?: string,
    data?: BlockToolData,
    config?: ToolConfig,
    index?: number,
    needToFocus?: boolean,
    replace?: boolean,
    id?: string,
  ): BlockAPI;
  insertMany(blocks: OutputBlockData[], index?: number): BlockAPI[];
  composeBlockData(toolName: string): Promise<BlockToolData>;
  update(
    id: string,
    data?: Partial<BlockToolData>,
    tunes?: { [name: string]: BlockTuneData },
  ): Promise<BlockAPI>;
  convert(
    id: string,
    newType: string,
    dataOverrides?: BlockToolData,
  ): Promise<BlockAPI>;
};
