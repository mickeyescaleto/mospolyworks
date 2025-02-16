import type { SavedData } from '@repo/editor/types/data-formats/block-data';
import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';
import type { ToolConfig } from '@repo/editor/types/tools/tool-config';
import type { ToolboxConfigEntry } from '@repo/editor/types/tools/tool-settings';

export type BlockAPI = {
  readonly id: string;
  readonly name: string;
  readonly config: ToolConfig;
  readonly holder: HTMLElement;
  readonly isEmpty: boolean;
  readonly selected: boolean;
  readonly focusable: boolean;
  stretched: boolean;
  call(methodName: string, param?: object): void;
  save(): Promise<void | SavedData>;
  validate(data: BlockToolData): Promise<boolean>;
  dispatchChange(): void;
  getActiveToolboxEntry(): Promise<ToolboxConfigEntry | undefined>;
};
