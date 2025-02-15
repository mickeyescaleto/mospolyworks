import type { ToolConstructable } from '@/types/tools';
import type { ToolSettings } from '@/types/tools/tool-settings';
import type { API } from '@/types';
import type { SanitizerConfig } from '@/types/configs/sanitizer-config';
import type { I18nConfig } from '@/types/configs/i18n-config';
import type { BlockMutationEvent } from '@/types/events/block';
import type { OutputData } from '@/types/data-formats/output-data';
import { LogLevels } from '@/types/configs/log-levels';

export type EditorConfig = {
  holderId?: string | HTMLElement;
  holder?: string | HTMLElement;
  autofocus?: boolean;
  defaultBlock?: string;
  initialBlock?: string;
  placeholder?: string | false;
  sanitizer?: SanitizerConfig;
  hideToolbar?: boolean;
  tools?: {
    [toolName: string]: ToolConstructable | ToolSettings;
  };
  data?: OutputData;
  minHeight?: number;
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
