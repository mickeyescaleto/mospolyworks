import Dom from '@repo/editor/components/dom';
import * as utilities from '@repo/editor/components/utilities';
import I18n from '@repo/editor/components/i18n';
import { CriticalError } from '@repo/editor/components/errors/critical';
import EventsDispatcher from '@repo/editor/components/utils/events';
import Modules from '@repo/editor/components/modules';

import type { EditorEventMap } from '@repo/editor/components/events';
import type { EditorModules } from '@repo/editor/types-internal/editor-modules';
import type { EditorConfig } from '@repo/editor/types/configs/editor-config';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';

export default class Core {
  public config: EditorConfig;

  public moduleInstances: EditorModules = {} as EditorModules;

  public isReady: Promise<void>;

  private eventsDispatcher: EventsDispatcher<EditorEventMap> =
    new EventsDispatcher();

  constructor(config: EditorConfig) {
    let onReady: (value?: void | PromiseLike<void>) => void;
    let onFail: (reason?: unknown) => void;

    this.isReady = new Promise((resolve, reject) => {
      onReady = resolve;
      onFail = reject;
    });

    Promise.resolve()
      .then(async () => {
        this.configuration = config;

        this.validate();
        this.init();
        await this.start();
        await this.render();

        const { BlockManager, Caret, UI, ModificationsObserver } =
          this.moduleInstances;

        UI.checkEmptiness();
        ModificationsObserver.enable();

        if (
          (this.configuration as EditorConfig).autofocus === true &&
          this.configuration.readOnly !== true
        ) {
          Caret.setToBlock(BlockManager.blocks[0], Caret.positions.START);
        }

        onReady();
      })
      .catch((error) => {
        utilities.log(`Editor is not ready because of ${error}`, 'error');

        onFail(error);
      });
  }

  public set configuration(config: EditorConfig) {
    this.config = {
      ...config,
    };

    if (this.config.holder === null) {
      this.config.holder = 'editor';
    }

    if (!this.config.logLevel) {
      this.config.logLevel = utilities.LogLevels.WARN;
    }

    utilities.setLogLevel(this.config.logLevel);

    this.config.defaultBlock = this.config.defaultBlock || 'paragraph';

    const defaultBlockData = {
      type: this.config.defaultBlock,
      data: {},
    };

    this.config.placeholder = this.config.placeholder || false;
    this.config.sanitizer =
      this.config.sanitizer ||
      ({
        p: true,
        b: true,
        a: true,
      } as SanitizerConfig);

    this.config.hideToolbar = this.config.hideToolbar
      ? this.config.hideToolbar
      : false;
    this.config.tools = this.config.tools || {};
    this.config.i18n = this.config.i18n || {};
    this.config.data = this.config.data || { blocks: [] };
    this.config.onReady = this.config.onReady || ((): void => {});
    this.config.onChange = this.config.onChange || ((): void => {});
    this.config.inlineToolbar =
      this.config.inlineToolbar !== undefined
        ? this.config.inlineToolbar
        : true;

    if (
      utilities.isEmpty(this.config.data) ||
      !this.config.data.blocks ||
      this.config.data.blocks.length === 0
    ) {
      this.config.data = { blocks: [defaultBlockData] };
    }

    this.config.readOnly = (this.config.readOnly as boolean) || false;

    if (this.config.i18n?.messages) {
      I18n.setDictionary(this.config.i18n.messages);
    }

    this.config.i18n.direction = this.config.i18n?.direction || 'ltr';
  }

  public get configuration(): EditorConfig {
    return this.config;
  }

  public validate(): void {
    const { holder } = this.config;

    if (utilities.isString(holder) && !Dom.get(holder)) {
      throw Error(
        `element with ID «${holder}» is missing. Pass correct holder's ID.`,
      );
    }

    if (holder && utilities.isObject(holder) && !Dom.isElement(holder)) {
      throw Error('«holder» value must be an Element node');
    }
  }

  public init(): void {
    this.constructModules();
    this.configureModules();
  }

  public async start(): Promise<void> {
    const modulesToPrepare = [
      'Tools',
      'UI',
      'BlockManager',
      'Paste',
      'BlockSelection',
      'RectangleSelection',
      'CrossBlockSelection',
      'ReadOnly',
    ];

    await modulesToPrepare.reduce(
      (promise, module) =>
        promise.then(async () => {
          try {
            await this.moduleInstances[module].prepare();
          } catch (e) {
            if (e instanceof CriticalError) {
              throw new Error(e.message);
            }
            utilities.log(
              `Module ${module} was skipped because of %o`,
              'warn',
              e,
            );
          }
        }),
      Promise.resolve(),
    );
  }

  private render(): Promise<void> {
    return this.moduleInstances.Renderer.render(this.config.data.blocks);
  }

  private constructModules(): void {
    Object.entries(Modules).forEach(([key, module]) => {
      try {
        this.moduleInstances[key] = new module({
          config: this.configuration,
          eventsDispatcher: this.eventsDispatcher,
        });
      } catch (e) {
        utilities.log(
          '[constructModules]',
          `Module ${key} skipped because`,
          'error',
          e,
        );
      }
    });
  }

  private configureModules(): void {
    for (const name in this.moduleInstances) {
      if (Object.prototype.hasOwnProperty.call(this.moduleInstances, name)) {
        this.moduleInstances[name].state = this.getModulesDiff(name);
      }
    }
  }

  private getModulesDiff(name: string): EditorModules {
    const diff = {} as EditorModules;

    for (const moduleName in this.moduleInstances) {
      if (moduleName === name) {
        continue;
      }
      diff[moduleName] = this.moduleInstances[moduleName];
    }

    return diff;
  }
}
