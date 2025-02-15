import type {
  ConfirmNotifierOptions,
  NotifierOptions,
  PromptNotifierOptions,
} from 'codex-notifier';

export type Notifier = {
  show(
    options: NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions,
  ): void;
};
