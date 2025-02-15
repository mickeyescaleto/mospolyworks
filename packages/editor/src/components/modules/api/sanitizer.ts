import Module from '@/components/__module';
import { clean } from '@/components/utils/sanitizer';

import type { Sanitizer as ISanitizer } from '@/types/api/sanitizer';
import type { SanitizerConfig } from '@/types/configs/sanitizer-config';

export default class SanitizerAPI extends Module {
  public get methods(): ISanitizer {
    return {
      clean: (taintString, config): string => this.clean(taintString, config),
    };
  }

  public clean(taintString: string, config: SanitizerConfig): string {
    return clean(taintString, config);
  }
}
