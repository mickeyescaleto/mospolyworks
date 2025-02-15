import Block from '@/components/block';

import type { SavedData } from '@/types/data-formats/block-data';
import type { BlockToolData } from '@/types/tools/block-tool-data';
import type { ToolConfig } from '@/types/tools/tool-config';
import type { ToolboxConfigEntry } from '@/types/tools/tool-settings';
import type { BlockAPI as IBlockAPI } from '@/types/api/block';

function BlockAPI(block: Block): void {
  const blockAPI: IBlockAPI = {
    get id(): string {
      return block.id;
    },
    get name(): string {
      return block.name;
    },
    get config(): ToolConfig {
      return block.config;
    },
    get holder(): HTMLElement {
      return block.holder;
    },
    get isEmpty(): boolean {
      return block.isEmpty;
    },
    get selected(): boolean {
      return block.selected;
    },
    set stretched(state: boolean) {
      block.stretched = state;
    },
    get stretched(): boolean {
      return block.stretched;
    },
    get focusable(): boolean {
      return block.focusable;
    },
    call(methodName: string, param?: object): unknown {
      return block.call(methodName, param);
    },
    save(): Promise<void | SavedData> {
      return block.save();
    },
    validate(data: BlockToolData): Promise<boolean> {
      return block.validate(data);
    },
    dispatchChange(): void {
      block.dispatchChange();
    },
    getActiveToolboxEntry(): Promise<ToolboxConfigEntry | undefined> {
      return block.getActiveToolboxEntry();
    },
  };

  Object.setPrototypeOf(this, blockAPI);
}

export default BlockAPI;
