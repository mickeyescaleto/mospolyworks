import Module from '@repo/editor/components/__module';

import type { API as APIInterfaces } from '@repo/editor/types';

export default class API extends Module {
  public get methods(): APIInterfaces {
    return {
      blocks: this.Editor.BlocksAPI.methods,
      caret: this.Editor.CaretAPI.methods,
      tools: this.Editor.ToolsAPI.methods,
      events: this.Editor.EventsAPI.methods,
      listeners: this.Editor.ListenersAPI.methods,
      notifier: this.Editor.NotifierAPI.methods,
      sanitizer: this.Editor.SanitizerAPI.methods,
      saver: this.Editor.SaverAPI.methods,
      selection: this.Editor.SelectionAPI.methods,
      styles: this.Editor.StylesAPI.classes,
      toolbar: this.Editor.ToolbarAPI.methods,
      inlineToolbar: this.Editor.InlineToolbarAPI.methods,
      tooltip: this.Editor.TooltipAPI.methods,
      i18n: this.Editor.I18nAPI.methods,
      readOnly: this.Editor.ReadOnlyAPI.methods,
      ui: this.Editor.UiAPI.methods,
    };
  }

  public getMethodsForTool(toolName: string, isTune: boolean): APIInterfaces {
    return Object.assign(this.methods, {
      i18n: this.Editor.I18nAPI.getMethodsForTool(toolName, isTune),
    }) as APIInterfaces;
  }
}
