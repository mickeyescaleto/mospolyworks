import Module from '@/components/__module';

import type { ReadOnly } from '@/types/api/readonly';

export default class ReadOnlyAPI extends Module {
  public get methods(): ReadOnly {
    const getIsEnabled = (): boolean => this.isEnabled;

    return {
      toggle: (state): Promise<boolean> => this.toggle(state),
      get isEnabled(): boolean {
        return getIsEnabled();
      },
    };
  }

  public toggle(state?: boolean): Promise<boolean> {
    return this.Editor.ReadOnly.toggle(state);
  }

  public get isEnabled(): boolean {
    return this.Editor.ReadOnly.isEnabled;
  }
}
