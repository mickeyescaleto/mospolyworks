import Dom, { toggleEmptyMark } from '@repo/editor/components/dom';
import * as utilities from '@repo/editor/components/utilities';
import BlockAPI from '@repo/editor/components/block/api';
import SelectionUtils from '@repo/editor/components/selection';
import EventsDispatcher from '@repo/editor/components/utils/events';
import ApiModules from '@repo/editor/components/modules/api';
import { isMutationBelongsToElement } from '@repo/editor/components/utils/mutations';
import {
  FakeCursorAboutToBeToggled,
  FakeCursorHaveBeenSet,
  RedactorDomChanged,
} from '@repo/editor/components/events';
import {
  convertBlockDataToString,
  isSameBlockData,
} from '@repo/editor/components/utils/blocks';
import BlockToolAdapter from '@repo/editor/components/tools/block';
import BlockTuneAdapter from '@repo/editor/components/tools/tune';
import ToolsCollection from '@repo/editor/components/tools/collection';
import { PopoverItemType } from '@repo/editor/types/utils/popover/popover-item-type';

import type { EditorEventMap } from '@repo/editor/components/events';
import type { RedactorDomChangedPayload } from '@repo/editor/components/events/redactor-dom-changed';
import type { MenuConfigItem } from '@repo/editor/types/tools/menu-config';
import type { BlockTuneData } from '@repo/editor/types/block-tunes/block-tune-data';
import type { SavedData } from '@repo/editor/types/data-formats/block-data';
import type { PopoverItemParams } from '@repo/editor/types/utils/popover/popover-item';
import type { ToolboxConfigEntry } from '@repo/editor/types/tools/tool-settings';
import type { ToolConfig } from '@repo/editor/types/tools/tool-config';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';
import type { BlockAPI as IBlockAPI } from '@repo/editor/types/api/block';
import type { BlockTool as IBlockTool } from '@repo/editor/types/tools/block-tool';
import type { BlockTune as IBlockTune } from '@repo/editor/types/block-tunes/block-tune';
import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';

type BlockConstructorOptions = {
  id?: string;
  data: BlockToolData;
  tool: BlockToolAdapter;
  api: ApiModules;
  readOnly: boolean;
  tunesData: { [name: string]: BlockTuneData };
};

export enum BlockToolAPI {
  APPEND_CALLBACK = 'appendCallback',
  RENDERED = 'rendered',
  MOVED = 'moved',
  UPDATED = 'updated',
  REMOVED = 'removed',
  ON_PASTE = 'onPaste',
}

type BlockEvents = {
  didMutated: Block;
};

export default class Block extends EventsDispatcher<BlockEvents> {
  public static get CSS(): { [name: string]: string } {
    return {
      wrapper: 'editor-block',
      wrapperStretched: 'editor-block--stretched',
      content: 'editor-block__content',
      selected: 'editor-block--selected',
      dropTarget: 'editor-block--drop-target',
    };
  }

  public id: string;

  public readonly name: string;

  public readonly tool: BlockToolAdapter;

  public readonly settings: ToolConfig;

  public readonly holder: HTMLDivElement;

  public readonly tunes: ToolsCollection<BlockTuneAdapter>;

  public readonly config: ToolConfig;

  private cachedInputs: HTMLElement[] = [];

  private toolRenderedElement: HTMLElement | null = null;

  private readonly toolInstance: IBlockTool;

  private readonly tunesInstances: Map<string, IBlockTune> = new Map();

  private readonly defaultTunesInstances: Map<string, IBlockTune> = new Map();

  private unavailableTunesData: { [name: string]: BlockTuneData } = {};

  private inputIndex = 0;

  private readonly editorEventBus: EventsDispatcher<EditorEventMap> | null =
    null;

  private redactorDomChangedCallback: (
    payload: RedactorDomChangedPayload,
  ) => void;

  private readonly blockAPI: IBlockAPI;

  constructor(
    {
      id = utilities.generateBlockId(),
      data,
      tool,
      readOnly,
      tunesData,
    }: BlockConstructorOptions,
    eventBus?: EventsDispatcher<EditorEventMap>,
  ) {
    super();
    this.name = tool.name;
    this.id = id;
    this.settings = tool.settings;
    this.config = tool.settings.config || {};
    this.editorEventBus = eventBus || null;
    this.blockAPI = new BlockAPI(this);

    this.tool = tool;
    this.toolInstance = tool.create(data, this.blockAPI, readOnly);

    this.tunes = tool.tunes;

    this.composeTunes(tunesData);

    this.holder = this.compose();

    window.requestIdleCallback(() => {
      this.watchBlockMutations();
      this.addInputEvents();
      this.toggleInputsEmptyMark();
    });
  }

  public get inputs(): HTMLElement[] {
    if (this.cachedInputs.length !== 0) {
      return this.cachedInputs;
    }

    const inputs = Dom.findAllInputs(this.holder);

    if (this.inputIndex > inputs.length - 1) {
      this.inputIndex = inputs.length - 1;
    }

    this.cachedInputs = inputs;

    return inputs;
  }

  public get currentInput(): HTMLElement | undefined {
    return this.inputs[this.inputIndex];
  }

  public set currentInput(element: HTMLElement) {
    const index = this.inputs.findIndex(
      (input) => input === element || input.contains(element),
    );

    if (index !== -1) {
      this.inputIndex = index;
    }
  }

  public get firstInput(): HTMLElement | undefined {
    return this.inputs[0];
  }

  public get lastInput(): HTMLElement | undefined {
    const inputs = this.inputs;

    return inputs[inputs.length - 1];
  }

  public get nextInput(): HTMLElement | undefined {
    return this.inputs[this.inputIndex + 1];
  }

  public get previousInput(): HTMLElement | undefined {
    return this.inputs[this.inputIndex - 1];
  }

  public get data(): Promise<BlockToolData> {
    return this.save().then((savedObject) => {
      if (savedObject && !utilities.isEmpty(savedObject.data)) {
        return savedObject.data;
      } else {
        return {};
      }
    });
  }

  public get sanitize(): SanitizerConfig {
    return this.tool.sanitizeConfig;
  }

  public get mergeable(): boolean {
    return utilities.isFunction(this.toolInstance.merge);
  }

  public get focusable(): boolean {
    return this.inputs.length !== 0;
  }

  public get isEmpty(): boolean {
    const emptyText = Dom.isEmpty(this.pluginsContent, '/');
    const emptyMedia = !this.hasMedia;

    return emptyText && emptyMedia;
  }

  public get hasMedia(): boolean {
    const mediaTags = [
      'img',
      'iframe',
      'video',
      'audio',
      'source',
      'input',
      'textarea',
      'twitterwidget',
    ];

    return !!this.holder.querySelector(mediaTags.join(','));
  }

  public set selected(state: boolean) {
    this.holder.classList.toggle(Block.CSS.selected, state);

    const fakeCursorWillBeAdded =
      state === true && SelectionUtils.isRangeInsideContainer(this.holder);
    const fakeCursorWillBeRemoved =
      state === false &&
      SelectionUtils.isFakeCursorInsideContainer(this.holder);

    if (fakeCursorWillBeAdded || fakeCursorWillBeRemoved) {
      this.editorEventBus?.emit(FakeCursorAboutToBeToggled, { state }); // mutex

      if (fakeCursorWillBeAdded) {
        SelectionUtils.addFakeCursor();
      } else {
        SelectionUtils.removeFakeCursor(this.holder);
      }

      this.editorEventBus?.emit(FakeCursorHaveBeenSet, { state });
    }
  }

  public get selected(): boolean {
    return this.holder.classList.contains(Block.CSS.selected);
  }

  public set stretched(state: boolean) {
    this.holder.classList.toggle(Block.CSS.wrapperStretched, state);
  }

  public get stretched(): boolean {
    return this.holder.classList.contains(Block.CSS.wrapperStretched);
  }

  public set dropTarget(state) {
    this.holder.classList.toggle(Block.CSS.dropTarget, state);
  }

  public get pluginsContent(): HTMLElement {
    return this.toolRenderedElement;
  }

  public call(methodName: string, params?: object): void {
    if (utilities.isFunction(this.toolInstance[methodName])) {
      if (methodName === BlockToolAPI.APPEND_CALLBACK) {
        utilities.log(
          '`appendCallback` hook is deprecated and will be removed in the next major release. ' +
            'Use `rendered` hook instead',
          'warn',
        );
      }

      try {
        this.toolInstance[methodName].call(this.toolInstance, params);
      } catch (error) {
        utilities.log(
          `Error during '${methodName}' call: ${error.message}`,
          'error',
        );
      }
    }
  }

  public async mergeWith(data: BlockToolData): Promise<void> {
    await this.toolInstance.merge(data);
  }

  public async save(): Promise<undefined | SavedData> {
    const extractedBlock = await this.toolInstance.save(
      this.pluginsContent as HTMLElement,
    );
    const tunesData: { [name: string]: BlockTuneData } =
      this.unavailableTunesData;

    [
      ...this.tunesInstances.entries(),
      ...this.defaultTunesInstances.entries(),
    ].forEach(([name, tune]) => {
      if (utilities.isFunction(tune.save)) {
        try {
          tunesData[name] = tune.save();
        } catch (e) {
          utilities.log(
            `Tune ${tune.constructor.name} save method throws an Error %o`,
            'warn',
            e,
          );
        }
      }
    });

    const measuringStart = window.performance.now();
    let measuringEnd;

    return Promise.resolve(extractedBlock)
      .then((finishedExtraction) => {
        measuringEnd = window.performance.now();

        return {
          id: this.id,
          tool: this.name,
          data: finishedExtraction,
          tunes: tunesData,
          time: measuringEnd - measuringStart,
        };
      })
      .catch((error) => {
        utilities.log(
          `Saving process for ${this.name} tool failed due to the ${error}`,
          'log',
          'red',
        );
      });
  }

  public async validate(data: BlockToolData): Promise<boolean> {
    let isValid = true;

    if (this.toolInstance.validate instanceof Function) {
      isValid = await this.toolInstance.validate(data);
    }

    return isValid;
  }

  public getTunes(): {
    toolTunes: PopoverItemParams[];
    commonTunes: PopoverItemParams[];
  } {
    const toolTunesPopoverParams: MenuConfigItem[] = [];
    const commonTunesPopoverParams: MenuConfigItem[] = [];

    const tunesDefinedInTool =
      typeof this.toolInstance.renderSettings === 'function'
        ? this.toolInstance.renderSettings()
        : [];

    if (Dom.isElement(tunesDefinedInTool)) {
      toolTunesPopoverParams.push({
        type: PopoverItemType.Html,
        element: tunesDefinedInTool,
      });
    } else if (Array.isArray(tunesDefinedInTool)) {
      toolTunesPopoverParams.push(...tunesDefinedInTool);
    } else {
      toolTunesPopoverParams.push(tunesDefinedInTool);
    }

    const commonTunes = [
      ...this.tunesInstances.values(),
      ...this.defaultTunesInstances.values(),
    ].map((tuneInstance) => tuneInstance.render());

    commonTunes.forEach((tuneConfig) => {
      if (Dom.isElement(tuneConfig)) {
        commonTunesPopoverParams.push({
          type: PopoverItemType.Html,
          element: tuneConfig,
        });
      } else if (Array.isArray(tuneConfig)) {
        commonTunesPopoverParams.push(...tuneConfig);
      } else {
        commonTunesPopoverParams.push(tuneConfig);
      }
    });

    return {
      toolTunes: toolTunesPopoverParams,
      commonTunes: commonTunesPopoverParams,
    };
  }

  public updateCurrentInput(): void {
    this.currentInput =
      Dom.isNativeInput(document.activeElement) || !SelectionUtils.anchorNode
        ? document.activeElement
        : SelectionUtils.anchorNode;
  }

  public dispatchChange(): void {
    this.didMutated();
  }

  public destroy(): void {
    this.unwatchBlockMutations();
    this.removeInputEvents();

    super.destroy();

    if (utilities.isFunction(this.toolInstance.destroy)) {
      this.toolInstance.destroy();
    }
  }

  public async getActiveToolboxEntry(): Promise<
    ToolboxConfigEntry | undefined
  > {
    const toolboxSettings = this.tool.toolbox;

    if (toolboxSettings.length === 1) {
      return Promise.resolve(this.tool.toolbox[0]);
    }

    const blockData = await this.data;
    const toolboxItems = toolboxSettings;

    return toolboxItems?.find((item) => {
      return isSameBlockData(item.data, blockData);
    });
  }

  public async exportDataAsString(): Promise<string> {
    const blockData = await this.data;

    return convertBlockDataToString(blockData, this.tool.conversionConfig);
  }

  private compose(): HTMLDivElement {
    const wrapper = Dom.make('div', Block.CSS.wrapper) as HTMLDivElement,
      contentNode = Dom.make('div', Block.CSS.content),
      pluginsContent = this.toolInstance.render();

    wrapper.dataset.id = this.id;

    this.toolRenderedElement = pluginsContent;

    contentNode.appendChild(this.toolRenderedElement);

    let wrappedContentNode: HTMLElement = contentNode;

    [
      ...this.tunesInstances.values(),
      ...this.defaultTunesInstances.values(),
    ].forEach((tune) => {
      if (utilities.isFunction(tune.wrap)) {
        try {
          wrappedContentNode = tune.wrap(wrappedContentNode);
        } catch (e) {
          utilities.log(
            `Tune ${tune.constructor.name} wrap method throws an Error %o`,
            'warn',
            e,
          );
        }
      }
    });

    wrapper.appendChild(wrappedContentNode);

    return wrapper;
  }

  private composeTunes(tunesData: { [name: string]: BlockTuneData }): void {
    Array.from(this.tunes.values()).forEach((tune) => {
      const collection = tune.isInternal
        ? this.defaultTunesInstances
        : this.tunesInstances;

      collection.set(
        tune.name,
        tune.create(tunesData[tune.name], this.blockAPI),
      );
    });

    Object.entries(tunesData).forEach(([name, data]) => {
      if (!this.tunesInstances.has(name)) {
        this.unavailableTunesData[name] = data;
      }
    });
  }

  private handleFocus = (): void => {
    this.dropInputsCache();
    this.updateCurrentInput();
  };

  private addInputEvents(): void {
    this.inputs.forEach((input) => {
      input.addEventListener('focus', this.handleFocus);

      if (Dom.isNativeInput(input)) {
        input.addEventListener('input', this.didMutated as EventListener);
      }
    });
  }

  private removeInputEvents(): void {
    this.inputs.forEach((input) => {
      input.removeEventListener('focus', this.handleFocus);

      if (Dom.isNativeInput(input)) {
        input.removeEventListener('input', this.didMutated as EventListener);
      }
    });
  }

  private readonly didMutated = (
    mutationsOrInputEvent: MutationRecord[] | InputEvent = undefined,
  ): void => {
    const isManuallyDispatched = mutationsOrInputEvent === undefined;

    const isInputEventHandler = mutationsOrInputEvent instanceof InputEvent;

    if (!isManuallyDispatched && !isInputEventHandler) {
      this.detectToolRootChange(mutationsOrInputEvent);
    }

    let shouldFireUpdate;

    if (isManuallyDispatched) {
      shouldFireUpdate = true;
    } else if (isInputEventHandler) {
      shouldFireUpdate = true;
    } else {
      const everyRecordIsMutationFree =
        mutationsOrInputEvent.length > 0 &&
        mutationsOrInputEvent.every((record) => {
          const { addedNodes, removedNodes, target } = record;
          const changedNodes = [
            ...Array.from(addedNodes),
            ...Array.from(removedNodes),
            target,
          ];

          return changedNodes.some((node) => {
            if (!Dom.isElement(node)) {
              node = node.parentElement;
            }

            return (
              node &&
              (node as HTMLElement).closest('[data-mutation-free="true"]') !==
                null
            );
          });
        });

      shouldFireUpdate = !everyRecordIsMutationFree;
    }

    if (!shouldFireUpdate) {
      return;
    }

    this.dropInputsCache();

    this.updateCurrentInput();

    this.toggleInputsEmptyMark();

    this.call(BlockToolAPI.UPDATED);

    this.emit('didMutated', this);
  };

  private watchBlockMutations(): void {
    this.redactorDomChangedCallback = (payload) => {
      const { mutations } = payload;

      const mutationBelongsToBlock = mutations.some((record) =>
        isMutationBelongsToElement(record, this.toolRenderedElement),
      );

      if (mutationBelongsToBlock) {
        this.didMutated(mutations);
      }
    };

    this.editorEventBus?.on(
      RedactorDomChanged,
      this.redactorDomChangedCallback,
    );
  }

  private unwatchBlockMutations(): void {
    this.editorEventBus?.off(
      RedactorDomChanged,
      this.redactorDomChangedCallback,
    );
  }

  private detectToolRootChange(mutations: MutationRecord[]): void {
    mutations.forEach((record) => {
      const toolRootHasBeenUpdated = Array.from(record.removedNodes).includes(
        this.toolRenderedElement,
      );

      if (toolRootHasBeenUpdated) {
        const newToolElement = record.addedNodes[record.addedNodes.length - 1];

        this.toolRenderedElement = newToolElement as HTMLElement;
      }
    });
  }

  private dropInputsCache(): void {
    this.cachedInputs = [];
  }

  private toggleInputsEmptyMark(): void {
    this.inputs.forEach(toggleEmptyMark);
  }
}
