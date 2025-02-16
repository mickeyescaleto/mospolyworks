import * as utilities from '@repo/editor/components/utilities';
import BlockAPI from '@repo/editor/components/block/api';
import Module from '@repo/editor/components/__module';
import Block from '@repo/editor/components/block';

import type { BlockAPI as BlockAPIInterface } from '@repo/editor/types/api/block';
import type { Blocks } from '@repo/editor/types/api/blocks';
import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';
import type { OutputBlockData } from '@repo/editor/types/data-formats/output-data';
import type { OutputData } from '@repo/editor/types/data-formats/output-data';
import type { ToolConfig } from '@repo/editor/types/tools/tool-config';
import type { BlockTuneData } from '@repo/editor/types/block-tunes/block-tune-data';

export default class BlocksAPI extends Module {
  public get methods(): Blocks {
    return {
      clear: (): Promise<void> => this.clear(),
      render: (data: OutputData): Promise<void> => this.render(data),
      renderFromHTML: (data: string): Promise<void> =>
        this.renderFromHTML(data),
      delete: (index?: number): void => this.delete(index),
      swap: (fromIndex: number, toIndex: number): void =>
        this.swap(fromIndex, toIndex),
      move: (toIndex: number, fromIndex?: number): void =>
        this.move(toIndex, fromIndex),
      getBlockByIndex: (index: number): BlockAPIInterface | undefined =>
        this.getBlockByIndex(index),
      getById: (id: string): BlockAPIInterface | null => this.getById(id),
      getCurrentBlockIndex: (): number => this.getCurrentBlockIndex(),
      getBlockIndex: (id: string): number => this.getBlockIndex(id),
      getBlocksCount: (): number => this.getBlocksCount(),
      getBlockByElement: (element: HTMLElement) =>
        this.getBlockByElement(element),
      stretchBlock: (index: number, status = true): void =>
        this.stretchBlock(index, status),
      insertNewBlock: (): void => this.insertNewBlock(),
      insert: this.insert,
      insertMany: this.insertMany,
      update: this.update,
      composeBlockData: this.composeBlockData,
      convert: this.convert,
    };
  }

  public getBlocksCount(): number {
    return this.Editor.BlockManager.blocks.length;
  }

  public getCurrentBlockIndex(): number {
    return this.Editor.BlockManager.currentBlockIndex;
  }

  public getBlockIndex(id: string): number | undefined {
    const block = this.Editor.BlockManager.getBlockById(id);

    if (!block) {
      utilities.logLabeled('There is no block with id `' + id + '`', 'warn');

      return;
    }

    return this.Editor.BlockManager.getBlockIndex(block);
  }

  public getBlockByIndex(index: number): BlockAPIInterface | undefined {
    const block = this.Editor.BlockManager.getBlockByIndex(index);

    if (block === undefined) {
      utilities.logLabeled(
        'There is no block at index `' + index + '`',
        'warn',
      );

      return;
    }

    return new BlockAPI(block);
  }

  public getById(id: string): BlockAPIInterface | null {
    const block = this.Editor.BlockManager.getBlockById(id);

    if (block === undefined) {
      utilities.logLabeled('There is no block with id `' + id + '`', 'warn');

      return null;
    }

    return new BlockAPI(block);
  }

  public getBlockByElement(
    element: HTMLElement,
  ): BlockAPIInterface | undefined {
    const block = this.Editor.BlockManager.getBlock(element);

    if (block === undefined) {
      utilities.logLabeled(
        'There is no block corresponding to element `' + element + '`',
        'warn',
      );

      return;
    }

    return new BlockAPI(block);
  }

  public swap(fromIndex: number, toIndex: number): void {
    utilities.log(
      '`blocks.swap()` method is deprecated and will be removed in the next major release. ' +
        'Use `block.move()` method instead',
      'info',
    );

    this.Editor.BlockManager.swap(fromIndex, toIndex);
  }

  public move(toIndex: number, fromIndex?: number): void {
    this.Editor.BlockManager.move(toIndex, fromIndex);
  }

  public delete(
    blockIndex: number = this.Editor.BlockManager.currentBlockIndex,
  ): void {
    try {
      const block = this.Editor.BlockManager.getBlockByIndex(blockIndex);

      this.Editor.BlockManager.removeBlock(block);
    } catch (e) {
      utilities.logLabeled(e, 'warn');

      return;
    }

    if (this.Editor.BlockManager.blocks.length === 0) {
      this.Editor.BlockManager.insert();
    }

    if (this.Editor.BlockManager.currentBlock) {
      this.Editor.Caret.setToBlock(
        this.Editor.BlockManager.currentBlock,
        this.Editor.Caret.positions.END,
      );
    }

    this.Editor.Toolbar.close();
  }

  public async clear(): Promise<void> {
    await this.Editor.BlockManager.clear(true);
    this.Editor.InlineToolbar.close();
  }

  public async render(data: OutputData): Promise<void> {
    if (data === undefined || data.blocks === undefined) {
      throw new Error('Incorrect data passed to the render() method');
    }

    this.Editor.ModificationsObserver.disable();

    await this.Editor.BlockManager.clear();
    await this.Editor.Renderer.render(data.blocks);

    this.Editor.ModificationsObserver.enable();
  }

  public renderFromHTML(data: string): Promise<void> {
    this.Editor.BlockManager.clear();

    return this.Editor.Paste.processText(data, true);
  }

  public stretchBlock(index: number, status = true): void {
    utilities.deprecationAssert(true, 'blocks.stretchBlock()', 'BlockAPI');

    const block = this.Editor.BlockManager.getBlockByIndex(index);

    if (!block) {
      return;
    }

    block.stretched = status;
  }

  public insert = (
    type: string = this.config.defaultBlock,
    data: BlockToolData = {},
    config: ToolConfig = {},
    index?: number,
    needToFocus?: boolean,
    replace?: boolean,
    id?: string,
  ): BlockAPIInterface => {
    const insertedBlock = this.Editor.BlockManager.insert({
      id,
      tool: type,
      data,
      index,
      needToFocus,
      replace,
    });

    return new BlockAPI(insertedBlock);
  };

  public composeBlockData = async (
    toolName: string,
  ): Promise<BlockToolData> => {
    const tool = this.Editor.Tools.blockTools.get(toolName);
    const block = new Block({
      tool,
      api: this.Editor.API,
      readOnly: true,
      data: {},
      tunesData: {},
    });

    return block.data;
  };

  public insertNewBlock(): void {
    utilities.log(
      'Method blocks.insertNewBlock() is deprecated and it will be removed in the next major release. ' +
        'Use blocks.insert() instead.',
      'warn',
    );
    this.insert();
  }

  public update = async (
    id: string,
    data?: Partial<BlockToolData>,
    tunes?: { [name: string]: BlockTuneData },
  ): Promise<BlockAPIInterface> => {
    const { BlockManager } = this.Editor;
    const block = BlockManager.getBlockById(id);

    if (block === undefined) {
      throw new Error(`Block with id "${id}" not found`);
    }

    const updatedBlock = await BlockManager.update(block, data, tunes);

    return new (BlockAPI as any)(updatedBlock);
  };

  private convert = async (
    id: string,
    newType: string,
    dataOverrides?: BlockToolData,
  ): Promise<BlockAPIInterface> => {
    const { BlockManager, Tools } = this.Editor;
    const blockToConvert = BlockManager.getBlockById(id);

    if (!blockToConvert) {
      throw new Error(`Block with id "${id}" not found`);
    }

    const originalBlockTool = Tools.blockTools.get(blockToConvert.name);
    const targetBlockTool = Tools.blockTools.get(newType);

    if (!targetBlockTool) {
      throw new Error(`Block Tool with type "${newType}" not found`);
    }

    const originalBlockConvertable =
      originalBlockTool?.conversionConfig?.export !== undefined;
    const targetBlockConvertable =
      targetBlockTool.conversionConfig?.import !== undefined;

    if (originalBlockConvertable && targetBlockConvertable) {
      const newBlock = await BlockManager.convert(
        blockToConvert,
        newType,
        dataOverrides,
      );

      return new BlockAPI(newBlock);
    } else {
      const unsupportedBlockTypes = [
        !originalBlockConvertable
          ? utilities.capitalize(blockToConvert.name)
          : false,
        !targetBlockConvertable ? utilities.capitalize(newType) : false,
      ]
        .filter(Boolean)
        .join(' and ');

      throw new Error(
        `Conversion from "${blockToConvert.name}" to "${newType}" is not possible. ${unsupportedBlockTypes} tool(s) should provide a "conversionConfig"`,
      );
    }
  };

  private insertMany = (
    blocks: OutputBlockData[],
    index: number = this.Editor.BlockManager.blocks.length - 1,
  ): BlockAPIInterface[] => {
    this.validateIndex(index);

    const blocksToInsert = blocks.map(({ id, type, data }) => {
      return this.Editor.BlockManager.composeBlock({
        id,
        tool: type || (this.config.defaultBlock as string),
        data,
      });
    });

    this.Editor.BlockManager.insertMany(blocksToInsert, index);

    return blocksToInsert.map((block) => new (BlockAPI as any)(block));
  };

  private validateIndex(index: unknown): void {
    if (typeof index !== 'number') {
      throw new Error('Index should be a number');
    }

    if (index < 0) {
      throw new Error(`Index should be greater than or equal to 0`);
    }

    if (index === null) {
      throw new Error(`Index should be greater than or equal to 0`);
    }
  }
}
