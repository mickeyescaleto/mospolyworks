import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';

export type Sanitizer = {
  clean(taintString: string, config: SanitizerConfig): string;
};
