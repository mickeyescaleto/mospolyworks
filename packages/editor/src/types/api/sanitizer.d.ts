import type { SanitizerConfig } from '@/types/configs/sanitizer-config';

export type Sanitizer = {
  clean(taintString: string, config: SanitizerConfig): string;
};
