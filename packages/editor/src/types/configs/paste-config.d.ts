import type { SanitizerConfig } from '@/types/configs/sanitizer-config';

type PasteConfigSpecified = {
  tags?: (string | SanitizerConfig)[];
  patterns?: { [key: string]: RegExp };
  files?: { extensions?: string[]; mimeTypes?: string[] };
};

export type PasteConfig = PasteConfigSpecified | false;
