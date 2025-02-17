import type { EditorConfig } from '@repo/editor/types/configs/editor-config';
import type { OutputData } from '@repo/editor/types/data-formats/output-data';
import type { Blocks } from '@repo/editor/types/api/blocks';
import type { Caret } from '@repo/editor/types/api/caret';
import type { Events } from '@repo/editor/types/api/events';
import type { InlineToolbar } from '@repo/editor/types/api/inline-toolbar';
import type { Listeners } from '@repo/editor/types/api/listeners';
import type { Notifier } from '@repo/editor/types/api/notifier';
import type { ReadOnly } from '@repo/editor/types/api/readonly';
import type { Sanitizer } from '@repo/editor/types/api/sanitizer';
import type { Saver } from '@repo/editor/types/api/saver';
import type { Selection } from '@repo/editor/types/api/selection';
import type { Styles } from '@repo/editor/types/api/styles';
import type { Toolbar } from '@repo/editor/types/api/toolbar';
import type { Tooltip } from '@repo/editor/types/api/tooltip';
import type { I18n } from '@repo/editor/types/api/i18n';
import type { Ui } from '@repo/editor/types/api/ui';
import type { Tools } from '@repo/editor/types/api/tools';

export { OutputData };

export type API = {
  blocks: Blocks;
  caret: Caret;
  tools: Tools;
  events: Events;
  listeners: Listeners;
  notifier: Notifier;
  sanitizer: Sanitizer;
  saver: Saver;
  selection: Selection;
  styles: Styles;
  toolbar: Toolbar;
  inlineToolbar: InlineToolbar;
  tooltip: Tooltip;
  i18n: I18n;
  readOnly: ReadOnly;
  ui: Ui;
};

declare class Editor {
  constructor(configuration: EditorConfig);
  public isReady: Promise<void>;
  public blocks: Blocks;
  public caret: Caret;
  public sanitizer: Sanitizer;
  public saver: Saver;
  public selection: Selection;
  public styles: Styles;
  public toolbar: Toolbar;
  public inlineToolbar: InlineToolbar;
  public readOnly: ReadOnly;
  public save(): Promise<OutputData>;
  public clear(): void;
  public render(data: OutputData): Promise<void>;
  public focus(atEnd?: boolean): boolean;
  public on(eventName: string, callback: (data?: any) => void): void;
  public off(eventName: string, callback: (data?: any) => void): void;
  public emit(eventName: string, data: any): void;
  public destroy(): void;
}

export as namespace Editor;
export default Editor;
