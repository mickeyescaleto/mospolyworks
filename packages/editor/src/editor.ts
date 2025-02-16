import '@babel/register';
import '@repo/editor/components/polyfills';

import Core from '@repo/editor/components/core';
import * as utilities from '@repo/editor/components/utilities';
import { destroy as destroyTooltip } from '@repo/editor/components/utils/tooltip';

import type { EditorConfig } from '@repo/editor/types/configs/editor-config';

export default class Editor {
  public isReady: Promise<void>;

  public destroy: () => void;

  constructor(configuration: EditorConfig) {
    let onReady = (): void => {};

    if (utilities.isFunction(configuration.onReady)) {
      onReady = configuration.onReady;
    }

    const editor = new Core(configuration);

    this.isReady = editor.isReady.then(() => {
      this.exportAPI(editor);
      onReady();
    });
  }

  public exportAPI(editor: Core): void {
    const fieldsToExport = ['configuration'];
    const destroy = (): void => {
      Object.values(editor.moduleInstances).forEach((moduleInstance) => {
        if (utilities.isFunction(moduleInstance.destroy)) {
          moduleInstance.destroy();
        }
        moduleInstance.listeners.removeAll();
      });

      destroyTooltip();

      editor = null;

      for (const field in this) {
        if (Object.prototype.hasOwnProperty.call(this, field)) {
          delete this[field];
        }
      }

      Object.setPrototypeOf(this, null);
    };

    fieldsToExport.forEach((field) => {
      this[field] = editor[field];
    });

    this.destroy = destroy;

    Object.setPrototypeOf(this, editor.moduleInstances.API.methods);

    delete this.exportAPI;

    const shorthands = {
      blocks: {
        clear: 'clear',
        render: 'render',
      },
      caret: {
        focus: 'focus',
      },
      events: {
        on: 'on',
        off: 'off',
        emit: 'emit',
      },
      saver: {
        save: 'save',
      },
    };

    Object.entries(shorthands).forEach(([key, methods]) => {
      Object.entries(methods).forEach(([name, alias]) => {
        this[alias] = editor.moduleInstances.API.methods[key][name];
      });
    });
  }
}
