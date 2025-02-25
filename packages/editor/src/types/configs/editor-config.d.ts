import type { ToolConstructable } from '@repo/editor/types/tools';
import type { ToolSettings } from '@repo/editor/types/tools/tool-settings';
import type { API } from '@repo/editor/types';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';
import type { I18nConfig } from '@repo/editor/types/configs/i18n-config';
import type { BlockMutationEvent } from '@repo/editor/types/events/block';
import type { OutputData } from '@repo/editor/types/data-formats/output-data';
import { LogLevels } from '@repo/editor/types/configs/log-levels';

export type EditorConfig = {
  holder?: string | HTMLElement;
  autofocus?: boolean;
  defaultBlock?: string;
  placeholder?: string | false;
  sanitizer?: SanitizerConfig;
  hideToolbar?: boolean;
  tools?: {
    [toolName: string]: ToolConstructable | ToolSettings;
  };
  data?: OutputData;
  logLevel?: LogLevels;
  readOnly?: boolean;
  i18n?: I18nConfig;
  onReady?(): void;
  onChange?(api: API, event: BlockMutationEvent | BlockMutationEvent[]): void;
  inlineToolbar?: string[] | boolean;
  tunes?: string[];
  style?: {
    nonce?: string;
  };
};
