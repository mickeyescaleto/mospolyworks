import Block, { BlockToolAPI } from '@repo/editor/components/block';
import Module from '@repo/editor/components/__module';
import Dom from '@repo/editor/components/dom';
import * as utilities from '@repo/editor/components/utilities';
import Blocks from '@repo/editor/components/blocks';
import BlockAPI from '@repo/editor/components/block/api';
import { BlockChanged } from '@repo/editor/components/events';
import { clean, sanitizeBlocks } from '@repo/editor/components/utils/sanitizer';
import {
  convertStringToBlockData,
  isBlockConvertable,
} from '@repo/editor/components/utils/blocks';
import PromiseQueue from '@repo/editor/components/utils/promise-queue';

import type {
  BlockMutationEventMap,
  BlockMutationType,
} from '@repo/editor/types/events/block';
import { BlockRemovedMutationType } from '@repo/editor/types/events/block/block-removed';
import { BlockAddedMutationType } from '@repo/editor/types/events/block/block-added';
import { BlockMovedMutationType } from '@repo/editor/types/events/block/block-moved';
import { BlockChangedMutationType } from '@repo/editor/types/events/block/block-changed';
import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';
import type { PasteEvent } from '@repo/editor/types/tools/paste-events';
import type { BlockTuneData } from '@repo/editor/types/block-tunes/block-tune-data';

export default class BlockManager extends Module {
  public get currentBlockIndex(): number {
    return this._currentBlockIndex;
  }

  public set currentBlockIndex(newIndex: number) {
    this._currentBlockIndex = newIndex;
  }

  public get firstBlock(): Block {
    return this._blocks[0];
  }

  public get lastBlock(): Block {
    return this._blocks[this._blocks.length - 1];
  }

  public get currentBlock(): Block | undefined {
    return this._blocks[this.currentBlockIndex];
  }

  public set currentBlock(block: Block) {
    this.currentBlockIndex = this.getBlockIndex(block);
  }

  public get nextBlock(): Block | null {
    const isLastBlock = this.currentBlockIndex === this._blocks.length - 1;

    if (isLastBlock) {
      return null;
    }

    return this._blocks[this.currentBlockIndex + 1];
  }

  public get nextContentfulBlock(): Block {
    const nextBlocks = this.blocks.slice(this.currentBlockIndex + 1);

    return nextBlocks.find((block) => !!block.inputs.length);
  }

  public get previousContentfulBlock(): Block {
    const previousBlocks = this.blocks
      .slice(0, this.currentBlockIndex)
      .reverse();

    return previousBlocks.find((block) => !!block.inputs.length);
  }

  public get previousBlock(): Block | null {
    const isFirstBlock = this.currentBlockIndex === 0;

    if (isFirstBlock) {
      return null;
    }

    return this._blocks[this.currentBlockIndex - 1];
  }

  public get blocks(): Block[] {
    return this._blocks.array;
  }

  public get isEditorEmpty(): boolean {
    return this.blocks.every((block) => block.isEmpty);
  }

  private _currentBlockIndex = -1;

  private _blocks: Blocks = null;

  public prepare(): void {
    const blocks = new Blocks(this.Editor.UI.nodes.redactor);

    this._blocks = new Proxy(blocks, {
      set: Blocks.set,
      get: Blocks.get,
    });

    this.listeners.on(document, 'copy', (e: ClipboardEvent) =>
      this.Editor.BlockEvents.handleCommandC(e),
    );
  }

  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      this.enableModuleBindings();
    } else {
      this.disableModuleBindings();
    }
  }

  public composeBlock({
    tool: name,
    data = {},
    id = undefined,
    tunes: tunesData = {},
  }: {
    tool: string;
    id?: string;
    data?: BlockToolData;
    tunes?: { [name: string]: BlockTuneData };
  }): Block {
    const readOnly = this.Editor.ReadOnly.isEnabled;
    const tool = this.Editor.Tools.blockTools.get(name);
    const block = new Block(
      {
        id,
        data,
        tool,
        api: this.Editor.API,
        readOnly,
        tunesData,
      },
      this.eventsDispatcher,
    );

    if (!readOnly) {
      window.requestIdleCallback(
        () => {
          this.bindBlockEvents(block);
        },
        { timeout: 2000 },
      );
    }

    return block;
  }

  public insert({
    id = undefined,
    tool = this.config.defaultBlock,
    data = {},
    index,
    needToFocus = true,
    replace = false,
    tunes = {},
  }: {
    id?: string;
    tool?: string;
    data?: BlockToolData;
    index?: number;
    needToFocus?: boolean;
    replace?: boolean;
    tunes?: { [name: string]: BlockTuneData };
  } = {}): Block {
    let newIndex = index;

    if (newIndex === undefined) {
      newIndex = this.currentBlockIndex + (replace ? 0 : 1);
    }

    const block = this.composeBlock({
      id,
      tool,
      data,
      tunes,
    });

    if (replace) {
      this.blockDidMutated(
        BlockRemovedMutationType,
        this.getBlockByIndex(newIndex),
        {
          index: newIndex,
        },
      );
    }

    this._blocks.insert(newIndex, block, replace);

    this.blockDidMutated(BlockAddedMutationType, block, {
      index: newIndex,
    });

    if (needToFocus) {
      this.currentBlockIndex = newIndex;
    } else if (newIndex <= this.currentBlockIndex) {
      this.currentBlockIndex++;
    }

    return block;
  }

  public insertMany(blocks: Block[], index = 0): void {
    this._blocks.insertMany(blocks, index);
  }

  public async update(
    block: Block,
    data?: Partial<BlockToolData>,
    tunes?: { [name: string]: BlockTuneData },
  ): Promise<Block> {
    if (!data && !tunes) {
      return block;
    }

    const existingData = await block.data;

    const newBlock = this.composeBlock({
      id: block.id,
      tool: block.name,
      data: Object.assign({}, existingData, data ?? {}),
      tunes: tunes ?? block.tunes,
    });

    const blockIndex = this.getBlockIndex(block);

    this._blocks.replace(blockIndex, newBlock);

    this.blockDidMutated(BlockChangedMutationType, newBlock, {
      index: blockIndex,
    });

    return newBlock;
  }

  public replace(block: Block, newTool: string, data: BlockToolData): Block {
    const blockIndex = this.getBlockIndex(block);

    return this.insert({
      tool: newTool,
      data,
      index: blockIndex,
      replace: true,
    });
  }

  public paste(
    toolName: string,
    pasteEvent: PasteEvent,
    replace = false,
  ): Block {
    const block = this.insert({
      tool: toolName,
      replace,
    });

    try {
      window.requestIdleCallback(() => {
        block.call(BlockToolAPI.ON_PASTE, pasteEvent);
      });
    } catch (e) {
      utilities.log(`${toolName}: onPaste callback call is failed`, 'error', e);
    }

    return block;
  }

  public insertDefaultBlockAtIndex(index: number, needToFocus = false): Block {
    const block = this.composeBlock({ tool: this.config.defaultBlock });

    this._blocks[index] = block;

    this.blockDidMutated(BlockAddedMutationType, block, {
      index,
    });

    if (needToFocus) {
      this.currentBlockIndex = index;
    } else if (index <= this.currentBlockIndex) {
      this.currentBlockIndex++;
    }

    return block;
  }

  public insertAtEnd(): Block {
    this.currentBlockIndex = this.blocks.length - 1;
    return this.insert();
  }

  public async mergeBlocks(
    targetBlock: Block,
    blockToMerge: Block,
  ): Promise<void> {
    let blockToMergeData: BlockToolData | undefined;

    if (targetBlock.name === blockToMerge.name && targetBlock.mergeable) {
      const blockToMergeDataRaw = await blockToMerge.data;

      if (utilities.isEmpty(blockToMergeDataRaw)) {
        console.error(
          'Could not merge Block. Failed to extract original Block data.',
        );

        return;
      }

      const [cleanData] = sanitizeBlocks(
        [blockToMergeDataRaw],
        targetBlock.tool.sanitizeConfig,
      );

      blockToMergeData = cleanData;
    } else if (
      targetBlock.mergeable &&
      isBlockConvertable(blockToMerge, 'export') &&
      isBlockConvertable(targetBlock, 'import')
    ) {
      const blockToMergeDataStringified =
        await blockToMerge.exportDataAsString();
      const cleanData = clean(
        blockToMergeDataStringified,
        targetBlock.tool.sanitizeConfig,
      );

      blockToMergeData = convertStringToBlockData(
        cleanData,
        targetBlock.tool.conversionConfig,
      );
    }

    if (blockToMergeData === undefined) {
      return;
    }

    await targetBlock.mergeWith(blockToMergeData);
    this.removeBlock(blockToMerge);
    this.currentBlockIndex = this._blocks.indexOf(targetBlock);
  }

  public removeBlock(block: Block, addLastBlock = true): Promise<void> {
    return new Promise((resolve) => {
      const index = this._blocks.indexOf(block);

      if (!this.validateIndex(index)) {
        throw new Error("Can't find a Block to remove");
      }

      block.destroy();
      this._blocks.remove(index);

      this.blockDidMutated(BlockRemovedMutationType, block, {
        index,
      });

      if (this.currentBlockIndex >= index) {
        this.currentBlockIndex--;
      }

      if (!this.blocks.length) {
        this.unsetCurrentBlock();

        if (addLastBlock) {
          this.insert();
        }
      } else if (index === 0) {
        this.currentBlockIndex = 0;
      }

      resolve();
    });
  }

  public removeSelectedBlocks(): number | undefined {
    let firstSelectedBlockIndex;

    for (let index = this.blocks.length - 1; index >= 0; index--) {
      if (!this.blocks[index].selected) {
        continue;
      }

      this.removeBlock(this.blocks[index]);
      firstSelectedBlockIndex = index;
    }

    return firstSelectedBlockIndex;
  }

  public removeAllBlocks(): void {
    for (let index = this.blocks.length - 1; index >= 0; index--) {
      this._blocks.remove(index);
    }

    this.unsetCurrentBlock();
    this.insert();
    this.currentBlock.firstInput.focus();
  }

  public split(): Block {
    const extractedFragment =
      this.Editor.Caret.extractFragmentFromCaretPosition();
    const wrapper = Dom.make('div');

    wrapper.appendChild(extractedFragment as DocumentFragment);

    const data = {
      text: Dom.isEmpty(wrapper) ? '' : wrapper.innerHTML,
    };

    return this.insert({ data });
  }

  public getBlockByIndex(index: -1): Block;

  public getBlockByIndex(index: number): Block | undefined;

  public getBlockByIndex(index: number): Block | undefined {
    if (index === -1) {
      index = this._blocks.length - 1;
    }

    return this._blocks[index];
  }

  public getBlockIndex(block: Block): number {
    return this._blocks.indexOf(block);
  }

  public getBlockById(id): Block | undefined {
    return this._blocks.array.find((block) => block.id === id);
  }

  public getBlock(element: HTMLElement): Block | undefined {
    if (!Dom.isElement(element) as boolean) {
      element = element.parentNode as HTMLElement;
    }

    const nodes = this._blocks.nodes,
      firstLevelBlock = element.closest(`.${Block.CSS.wrapper}`),
      index = nodes.indexOf(firstLevelBlock as HTMLElement);

    if (index >= 0) {
      return this._blocks[index];
    }
  }

  public setCurrentBlockByChildNode(childNode: Node): Block | undefined {
    if (!Dom.isElement(childNode)) {
      childNode = childNode.parentNode;
    }

    const parentFirstLevelBlock = (childNode as HTMLElement).closest(
      `.${Block.CSS.wrapper}`,
    );

    if (!parentFirstLevelBlock) {
      return;
    }

    const editorWrapper = parentFirstLevelBlock.closest(
      `.${this.Editor.UI.CSS.editorWrapper}`,
    );
    const isBlockBelongsToCurrentInstance = editorWrapper?.isEqualNode(
      this.Editor.UI.nodes.wrapper,
    );

    if (!isBlockBelongsToCurrentInstance) {
      return;
    }

    this.currentBlockIndex = this._blocks.nodes.indexOf(
      parentFirstLevelBlock as HTMLElement,
    );

    this.currentBlock.updateCurrentInput();

    return this.currentBlock;
  }

  public getBlockByChildNode(childNode: Node): Block | undefined {
    if (!childNode || childNode instanceof Node === false) {
      return undefined;
    }

    if (!Dom.isElement(childNode)) {
      childNode = childNode.parentNode;
    }

    const firstLevelBlock = (childNode as HTMLElement).closest(
      `.${Block.CSS.wrapper}`,
    );

    return this.blocks.find((block) => block.holder === firstLevelBlock);
  }

  public swap(fromIndex, toIndex): void {
    this._blocks.swap(fromIndex, toIndex);
    this.currentBlockIndex = toIndex;
  }

  public move(toIndex, fromIndex = this.currentBlockIndex): void {
    if (isNaN(toIndex) || isNaN(fromIndex)) {
      utilities.log(
        `Warning during 'move' call: incorrect indices provided.`,
        'warn',
      );

      return;
    }

    if (!this.validateIndex(toIndex) || !this.validateIndex(fromIndex)) {
      utilities.log(
        `Warning during 'move' call: indices cannot be lower than 0 or greater than the amount of blocks.`,
        'warn',
      );

      return;
    }

    this._blocks.move(toIndex, fromIndex);

    this.currentBlockIndex = toIndex;

    this.blockDidMutated(BlockMovedMutationType, this.currentBlock, {
      fromIndex,
      toIndex,
    });
  }

  public async convert(
    blockToConvert: Block,
    targetToolName: string,
    blockDataOverrides?: BlockToolData,
  ): Promise<Block> {
    const savedBlock = await blockToConvert.save();

    if (!savedBlock) {
      throw new Error(
        'Could not convert Block. Failed to extract original Block data.',
      );
    }

    const replacingTool = this.Editor.Tools.blockTools.get(targetToolName);

    if (!replacingTool) {
      throw new Error(
        `Could not convert Block. Tool «${targetToolName}» not found.`,
      );
    }

    const exportedData = await blockToConvert.exportDataAsString();

    const cleanData: string = clean(exportedData, replacingTool.sanitizeConfig);

    let newBlockData = convertStringToBlockData(
      cleanData,
      replacingTool.conversionConfig,
      replacingTool.settings,
    );

    if (blockDataOverrides) {
      newBlockData = Object.assign(newBlockData, blockDataOverrides);
    }

    return this.replace(blockToConvert, replacingTool.name, newBlockData);
  }

  public unsetCurrentBlock(): void {
    this.currentBlockIndex = -1;
  }

  public async clear(needToAddDefaultBlock = false): Promise<void> {
    const queue = new PromiseQueue();

    this.blocks.forEach((block) => {
      queue.add(async () => {
        await this.removeBlock(block, false);
      });
    });

    await queue.completed;

    this.unsetCurrentBlock();

    if (needToAddDefaultBlock) {
      this.insert();
    }

    this.Editor.UI.checkEmptiness();
  }

  public async destroy(): Promise<void> {
    await Promise.all(
      this.blocks.map((block) => {
        return block.destroy();
      }),
    );
  }

  private bindBlockEvents(block: Block): void {
    const { BlockEvents } = this.Editor;

    this.readOnlyMutableListeners.on(
      block.holder,
      'keydown',
      (event: KeyboardEvent) => {
        BlockEvents.keydown(event);
      },
    );

    this.readOnlyMutableListeners.on(
      block.holder,
      'keyup',
      (event: KeyboardEvent) => {
        BlockEvents.keyup(event);
      },
    );

    this.readOnlyMutableListeners.on(
      block.holder,
      'dragover',
      (event: DragEvent) => {
        BlockEvents.dragOver(event);
      },
    );

    this.readOnlyMutableListeners.on(
      block.holder,
      'dragleave',
      (event: DragEvent) => {
        BlockEvents.dragLeave(event);
      },
    );

    block.on('didMutated', (affectedBlock: Block) => {
      return this.blockDidMutated(BlockChangedMutationType, affectedBlock, {
        index: this.getBlockIndex(affectedBlock),
      });
    });
  }

  private disableModuleBindings(): void {
    this.readOnlyMutableListeners.clearAll();
  }

  private enableModuleBindings(): void {
    this.readOnlyMutableListeners.on(document, 'cut', (e: ClipboardEvent) =>
      this.Editor.BlockEvents.handleCommandX(e),
    );

    this.blocks.forEach((block: Block) => {
      this.bindBlockEvents(block);
    });
  }

  private validateIndex(index: number): boolean {
    return !(index < 0 || index >= this._blocks.length);
  }

  private blockDidMutated<Type extends BlockMutationType>(
    mutationType: Type,
    block: Block,
    detailData: BlockMutationEventDetailWithoutTarget<Type>,
  ): Block {
    const event = new CustomEvent(mutationType, {
      detail: {
        target: new BlockAPI(block),
        ...(detailData as BlockMutationEventDetailWithoutTarget<Type>),
      },
    });

    this.eventsDispatcher.emit(BlockChanged, {
      event: event as BlockMutationEventMap[Type],
    });

    return block;
  }
}

type BlockMutationEventDetailWithoutTarget<Type extends BlockMutationType> =
  Omit<BlockMutationEventMap[Type]['detail'], 'target'>;
