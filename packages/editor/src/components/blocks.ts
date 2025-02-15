import * as utilities from '@/components/utilities';
import Dom from '@/components/dom';
import Block, { BlockToolAPI } from '@/components/block';

import type { MoveEvent } from '@/types/tools/hook-events';

export default class Blocks {
  public blocks: Block[];

  public workingArea: HTMLElement;

  constructor(workingArea: HTMLElement) {
    this.blocks = [];
    this.workingArea = workingArea;
  }

  public get length(): number {
    return this.blocks.length;
  }

  public get array(): Block[] {
    return this.blocks;
  }

  public get nodes(): HTMLElement[] {
    return utilities.array(this.workingArea.children);
  }

  public static set(
    instance: Blocks,
    property: PropertyKey,
    value: Block | unknown,
  ): boolean {
    if (isNaN(Number(property))) {
      Reflect.set(instance, property, value);

      return true;
    }

    instance.insert(+(property as number), value as Block);

    return true;
  }

  public static get(instance: Blocks, property: PropertyKey): Block | unknown {
    if (isNaN(Number(property))) {
      return Reflect.get(instance, property);
    }

    return instance.get(+(property as number));
  }

  public push(block: Block): void {
    this.blocks.push(block);
    this.insertToDOM(block);
  }

  public swap(first: number, second: number): void {
    const secondBlock = this.blocks[second];

    Dom.swap(this.blocks[first].holder, secondBlock.holder);

    this.blocks[second] = this.blocks[first];
    this.blocks[first] = secondBlock;
  }

  public move(toIndex: number, fromIndex: number): void {
    const block = this.blocks.splice(fromIndex, 1)[0];

    const prevIndex = toIndex - 1;
    const previousBlockIndex = Math.max(0, prevIndex);
    const previousBlock = this.blocks[previousBlockIndex];

    if (toIndex > 0) {
      this.insertToDOM(block, 'afterend', previousBlock);
    } else {
      this.insertToDOM(block, 'beforebegin', previousBlock);
    }

    this.blocks.splice(toIndex, 0, block);

    const event: MoveEvent = this.composeBlockEvent('move', {
      fromIndex,
      toIndex,
    });

    block.call(BlockToolAPI.MOVED, event);
  }

  public insert(index: number, block: Block, replace = false): void {
    if (!this.length) {
      this.push(block);

      return;
    }

    if (index > this.length) {
      index = this.length;
    }

    if (replace) {
      this.blocks[index].holder.remove();
      this.blocks[index].call(BlockToolAPI.REMOVED);
    }

    const deleteCount = replace ? 1 : 0;

    this.blocks.splice(index, deleteCount, block);

    if (index > 0) {
      const previousBlock = this.blocks[index - 1];

      this.insertToDOM(block, 'afterend', previousBlock);
    } else {
      const nextBlock = this.blocks[index + 1];

      if (nextBlock) {
        this.insertToDOM(block, 'beforebegin', nextBlock);
      } else {
        this.insertToDOM(block);
      }
    }
  }

  public replace(index: number, block: Block): void {
    if (this.blocks[index] === undefined) {
      throw Error('Incorrect index');
    }

    const prevBlock = this.blocks[index];

    prevBlock.holder.replaceWith(block.holder);

    this.blocks[index] = block;
  }

  public insertMany(blocks: Block[], index: number): void {
    const fragment = new DocumentFragment();

    for (const block of blocks) {
      fragment.appendChild(block.holder);
    }

    if (this.length > 0) {
      if (index > 0) {
        const previousBlockIndex = Math.min(index - 1, this.length - 1);
        const previousBlock = this.blocks[previousBlockIndex];

        previousBlock.holder.after(fragment);
      } else if (index === 0) {
        this.workingArea.prepend(fragment);
      }

      this.blocks.splice(index, 0, ...blocks);
    } else {
      this.blocks.push(...blocks);
      this.workingArea.appendChild(fragment);
    }

    blocks.forEach((block) => block.call(BlockToolAPI.RENDERED));
  }

  public remove(index: number): void {
    if (isNaN(index)) {
      index = this.length - 1;
    }

    this.blocks[index].holder.remove();

    this.blocks[index].call(BlockToolAPI.REMOVED);

    this.blocks.splice(index, 1);
  }

  public removeAll(): void {
    this.workingArea.innerHTML = '';

    this.blocks.forEach((block) => block.call(BlockToolAPI.REMOVED));

    this.blocks.length = 0;
  }

  public insertAfter(targetBlock: Block, newBlock: Block): void {
    const index = this.blocks.indexOf(targetBlock);

    this.insert(index + 1, newBlock);
  }

  public get(index: number): Block | undefined {
    return this.blocks[index];
  }

  public indexOf(block: Block): number {
    return this.blocks.indexOf(block);
  }

  private insertToDOM(
    block: Block,
    position?: InsertPosition,
    target?: Block,
  ): void {
    if (position) {
      target.holder.insertAdjacentElement(position, block.holder);
    } else {
      this.workingArea.appendChild(block.holder);
    }

    block.call(BlockToolAPI.RENDERED);
  }

  private composeBlockEvent(type: string, detail: object): MoveEvent {
    return new CustomEvent(type, {
      detail,
    }) as MoveEvent;
  }
}
