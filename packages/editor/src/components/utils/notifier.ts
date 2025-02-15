import notifier from 'codex-notifier';

import type {
  ConfirmNotifierOptions,
  NotifierOptions,
  PromptNotifierOptions,
} from 'codex-notifier';

export default class Notifier {
  public show(
    options: NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions,
  ): void {
    notifier.show(options);
  }
}
