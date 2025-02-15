import type { EditorConfig } from '@/types/configs/editor-config';
import type { OutputData } from '@/types/data-formats/output-data';
import type { Blocks } from '@/types/api/blocks';
import type { Caret } from '@/types/api/caret';
import type { Events } from '@/types/api/events';
import type { InlineToolbar } from '@/types/api/inline-toolbar';
import type { Listeners } from '@/types/api/listeners';
import type { Notifier } from '@/types/api/notifier';
import type { ReadOnly } from '@/types/api/readonly';
import type { Sanitizer } from '@/types/api/sanitizer';
import type { Saver } from '@/types/api/saver';
import type { Selection } from '@/types/api/selection';
import type { Styles } from '@/types/api/styles';
import type { Toolbar } from '@/types/api/toolbar';
import type { Tooltip } from '@/types/api/tooltip';
import type { I18n } from '@/types/api/i18n';
import type { Ui } from '@/types/api/ui';
import type { Tools } from '@/types/api/tools';

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
