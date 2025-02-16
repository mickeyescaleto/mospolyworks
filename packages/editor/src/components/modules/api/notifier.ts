import type {
  ConfirmNotifierOptions,
  NotifierOptions,
  PromptNotifierOptions,
} from 'codex-notifier';
import Notifier from '@repo/editor/components/utils/notifier';
import Module from '@repo/editor/components/__module';

import type { ModuleConfig } from '@repo/editor/types-internal/module-config';
import type { Notifier as INotifier } from '@repo/editor/types/api/notifier';

export default class NotifierAPI extends Module {
  private notifier: Notifier;

  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });

    this.notifier = new Notifier();
  }

  public get methods(): INotifier {
    return {
      show: (
        options:
          | NotifierOptions
          | ConfirmNotifierOptions
          | PromptNotifierOptions,
      ): void => this.show(options),
    };
  }

  public show(
    options: NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions,
  ): void {
    return this.notifier.show(options);
  }
}
