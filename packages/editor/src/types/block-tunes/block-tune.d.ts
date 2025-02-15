import type { API } from '@/types';
import type { ToolConfig } from '@/types/tools/tool-config';
import type { BlockTuneData } from '@/types/block-tunes/block-tune-data';
import type { MenuConfig } from '@/types/tools/menu-config';
import type { BlockAPI } from '@/types/api/block';
import type { SanitizerConfig } from '@/types/configs/sanitizer-config';

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
