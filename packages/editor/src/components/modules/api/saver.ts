import * as utilities from '@repo/editor/components/utilities';
import Module from '@repo/editor/components/__module';

import type { Saver } from '@repo/editor/types/api/saver';
import type { OutputData } from '@repo/editor/types/data-formats/output-data';

export default class SaverAPI extends Module {
  public get methods(): Saver {
    return {
      save: (): Promise<OutputData> => this.save(),
    };
  }

  public save(): Promise<OutputData> {
    const errorText = "Editor's content can not be saved in read-only mode";

    if (this.Editor.ReadOnly.isEnabled) {
      utilities.logLabeled(errorText, 'warn');

      return Promise.reject(new Error(errorText));
    }

    return this.Editor.Saver.save();
  }
}
