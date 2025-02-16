import type { API } from '@repo/editor/types';
import type { ToolConfig } from '@repo/editor/types/tools/tool-config';
import type { BlockTuneData } from '@repo/editor/types/block-tunes/block-tune-data';
import type { MenuConfig } from '@repo/editor/types/tools/menu-config';
import type { BlockAPI } from '@repo/editor/types/api/block';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';

export type BlockTune = {
  render(): HTMLElement | MenuConfig;
  wrap?(pluginsContent: HTMLElement): HTMLElement;
  save?(): BlockTuneData;
};

export type BlockTuneConstructable = {
  new (config: {
    api: API;
    config?: ToolConfig;
    block: BlockAPI;
    data: BlockTuneData;
  }): BlockTune;
  isTune: boolean;
  sanitize?: SanitizerConfig;
  prepare?(): Promise<void> | void;
  reset?(): void | Promise<void>;
};
