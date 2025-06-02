import { OrderedListRenderer } from '../ListRenderer/OrderedListRenderer';
import type { ListConfig, ListData, ListDataStyle } from '../types/ListParams';
import type { ListItem } from '../types/ListParams';
import type { ItemElement, ItemChildWrapperElement } from '../types/Elements';
import { isHtmlElement } from '../utils/type-guards';
import {
  getContenteditableSlice,
  getCaretNodeAndOffset,
  isCaretAtStartOfInput,
} from '@editorjs/caret';
import { DefaultListCssClasses } from '../ListRenderer';
import type { PasteEvent } from '../types';
import type { ListParams } from '..';
import type {
  ItemMeta,
  OrderedListItemMeta,
  UnorderedListItemMeta,
} from '../types/ItemMeta';
import type { ListRenderer } from '../types/ListRenderer';
import { getSiblings } from '../utils/getSiblings';
import { getChildItems } from '../utils/getChildItems';
import { isLastItem } from '../utils/isLastItem';
import { itemHasSublist } from '../utils/itemHasSublist';
import { getItemChildWrapper } from '../utils/getItemChildWrapper';
import { removeChildWrapperIfEmpty } from '../utils/removeChildWrapperIfEmpty';
import { getItemContentElement } from '../utils/getItemContentElement';
import { focusItem } from '../utils/focusItem';
import type { OlCounterType } from '../types/OlCounterType';
import { API } from '@repo/editor/types';
import { BlockAPI } from '@repo/editor/types/api/block';
import { PasteConfig } from '@repo/editor/types/configs/paste-config';

export default class ListTabulator<Renderer extends ListRenderer> {
  private api: API;

  private readOnly: boolean;

  private config?: ListConfig;

  private data: ListData;

  private block: BlockAPI;

  private renderer: Renderer;

  private listWrapper: ItemChildWrapperElement | undefined;

  private get currentItem(): ItemElement | null {
    const selection = window.getSelection();

    if (!selection) {
      return null;
    }

    let currentNode = selection.anchorNode;

    if (!currentNode) {
      return null;
    }

    if (!isHtmlElement(currentNode)) {
      currentNode = currentNode.parentNode;
    }
    if (!currentNode) {
      return null;
    }
    if (!isHtmlElement(currentNode)) {
      return null;
    }

    return currentNode.closest(`.${DefaultListCssClasses.item}`);
  }

  private get currentItemLevel(): number | null {
    const currentItem = this.currentItem;

    if (currentItem === null) {
      return null;
    }

    let parentNode = currentItem.parentNode;

    let levelCounter = 0;

    while (parentNode !== null && parentNode !== this.listWrapper) {
      if (
        isHtmlElement(parentNode) &&
        parentNode.classList.contains(DefaultListCssClasses.item)
      ) {
        levelCounter += 1;
      }

      parentNode = parentNode.parentNode;
    }

    return levelCounter + 1;
  }

  constructor(
    { data, config, api, readOnly, block }: ListParams,
    renderer: Renderer,
  ) {
    this.config = config;
    this.data = data as ListData;
    this.readOnly = readOnly;
    this.api = api;
    this.block = block;

    this.renderer = renderer;
  }

  public render(): ItemChildWrapperElement {
    this.listWrapper = this.renderer.renderWrapper(true);

    if (this.data.items.length) {
      this.appendItems(this.data.items, this.listWrapper);
    } else {
      this.appendItems(
        [
          {
            content: '',
            meta: {},
            items: [],
          },
        ],
        this.listWrapper,
      );
    }

    if (!this.readOnly) {
      this.listWrapper.addEventListener(
        'keydown',
        (event) => {
          switch (event.key) {
            case 'Enter':
              if (!event.shiftKey) {
                this.enterPressed(event);
              }
              break;
            case 'Backspace':
              this.backspace(event);
              break;
            case 'Tab':
              if (event.shiftKey) {
                this.shiftTab(event);
              } else {
                this.addTab(event);
              }
              break;
          }
        },
        false,
      );
    }

    if ('start' in this.data.meta && this.data.meta.start !== undefined) {
      this.changeStartWith(this.data.meta.start);
    }

    if (
      'counterType' in this.data.meta &&
      this.data.meta.counterType !== undefined
    ) {
      this.changeCounters(this.data.meta.counterType);
    }

    return this.listWrapper;
  }

  public save(wrapper?: ItemChildWrapperElement): ListData {
    const listWrapper = wrapper ?? this.listWrapper;

    const getItems = (parent: ItemChildWrapperElement): ListItem[] => {
      const children = getChildItems(parent);

      return children.map((el) => {
        const subItemsWrapper = getItemChildWrapper(el);
        const content = this.renderer.getItemContent(el);
        const meta = this.renderer.getItemMeta(el);
        const subItems = subItemsWrapper ? getItems(subItemsWrapper) : [];

        return {
          content,
          meta,
          items: subItems,
        };
      });
    };

    const composedListItems = listWrapper ? getItems(listWrapper) : [];

    let dataToSave: ListData = {
      style: this.data.style,
      meta: {} as ItemMeta,
      items: composedListItems,
    };

    if (this.data.style === 'ordered') {
      dataToSave.meta = {
        start: (this.data.meta as OrderedListItemMeta).start,
        counterType: (this.data.meta as OrderedListItemMeta).counterType,
      };
    }

    return dataToSave;
  }

  public static get pasteConfig(): PasteConfig {
    return {
      tags: ['OL', 'UL', 'LI'],
    };
  }

  public merge(data: ListData): void {
    const items = this.block.holder.querySelectorAll<ItemElement>(
      `.${DefaultListCssClasses.item}`,
    );

    const deepestBlockItem = items[items.length - 1];
    const deepestBlockItemContentElement =
      getItemContentElement(deepestBlockItem);

    if (deepestBlockItem === null || deepestBlockItemContentElement === null) {
      return;
    }

    deepestBlockItemContentElement.insertAdjacentHTML(
      'beforeend',
      data.items[0].content,
    );

    if (this.listWrapper === undefined) {
      return;
    }

    const firstLevelItems = getChildItems(this.listWrapper);

    if (firstLevelItems.length === 0) {
      return;
    }

    const lastFirstLevelItem = firstLevelItems[firstLevelItems.length - 1];

    let lastFirstLevelItemChildWrapper =
      getItemChildWrapper(lastFirstLevelItem);

    const firstItem = data.items.shift();

    if (firstItem === undefined) {
      return;
    }

    if (firstItem.items.length !== 0) {
      if (lastFirstLevelItemChildWrapper === null) {
        lastFirstLevelItemChildWrapper = this.renderer.renderWrapper(false);
      }

      this.appendItems(firstItem.items, lastFirstLevelItemChildWrapper);
    }

    if (data.items.length > 0) {
      this.appendItems(data.items, this.listWrapper);
    }
  }

  public onPaste(event: PasteEvent): void {
    const list = event.detail.data;

    this.data = this.pasteHandler(list);

    const oldView = this.listWrapper;

    if (oldView && oldView.parentNode) {
      oldView.parentNode.replaceChild(this.render(), oldView);
    }
  }

  public pasteHandler(element: PasteEvent['detail']['data']): ListData {
    const { tagName: tag } = element;
    let style: ListDataStyle = 'unordered';
    let tagToSearch: string;

    switch (tag) {
      case 'OL':
        style = 'ordered';
        tagToSearch = 'ol';
        break;
      case 'UL':
      case 'LI':
        style = 'unordered';
        tagToSearch = 'ul';
    }

    const data: ListData = {
      style,
      meta: {} as ItemMeta,
      items: [],
    };

    if (style === 'ordered') {
      (this.data.meta as OrderedListItemMeta).counterType = 'numeric';
      (this.data.meta as OrderedListItemMeta).start = 1;
    }

    const getPastedItems = (parent: Element): ListItem[] => {
      const children = Array.from(parent.querySelectorAll(`:scope > li`));

      return children.map((child) => {
        const subItemsWrapper = child.querySelector(`:scope > ${tagToSearch}`);
        const subItems = subItemsWrapper ? getPastedItems(subItemsWrapper) : [];
        const content = child.innerHTML ?? '';

        return {
          content,
          meta: {},
          items: subItems,
        };
      });
    };

    data.items = getPastedItems(element);

    return data;
  }

  public changeStartWith(index: number): void {
    this.listWrapper!.style.setProperty('counter-reset', `item ${index - 1}`);

    (this.data.meta as OrderedListItemMeta).start = index;
  }

  public changeCounters(counterType: OlCounterType): void {
    this.listWrapper!.style.setProperty('--list-counter-type', counterType);

    (this.data.meta as OrderedListItemMeta).counterType = counterType;
  }

  private enterPressed(event: KeyboardEvent): void {
    const currentItem = this.currentItem;

    event.stopPropagation();

    event.preventDefault();

    if (event.isComposing) {
      return;
    }
    if (currentItem === null) {
      return;
    }

    const isEmpty =
      this.renderer?.getItemContent(currentItem).trim().length === 0;
    const isFirstLevelItem = currentItem.parentNode === this.listWrapper;
    const isFirstItem = currentItem.previousElementSibling === null;

    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

    if (isFirstLevelItem && isEmpty) {
      if (isLastItem(currentItem) && !itemHasSublist(currentItem)) {
        if (isFirstItem) {
          this.convertItemToDefaultBlock(currentBlockIndex, true);
        } else {
          this.convertItemToDefaultBlock();
        }

        return;
      } else {
        this.splitList(currentItem);

        return;
      }
    } else if (isEmpty) {
      this.unshiftItem(currentItem);

      return;
    } else {
      this.splitItem(currentItem);
    }
  }

  private backspace(event: KeyboardEvent): void {
    const currentItem = this.currentItem;

    if (currentItem === null) {
      return;
    }

    if (!isCaretAtStartOfInput(currentItem)) {
      return;
    }

    if (window.getSelection()?.isCollapsed === false) {
      return;
    }

    event.stopPropagation();

    if (
      currentItem.parentNode === this.listWrapper &&
      currentItem.previousElementSibling === null
    ) {
      this.convertFirstItemToDefaultBlock();

      return;
    }

    event.preventDefault();

    this.mergeItemWithPrevious(currentItem);
  }

  private shiftTab(event: KeyboardEvent): void {
    event.stopPropagation();

    event.preventDefault();

    if (this.currentItem === null) {
      return;
    }

    this.unshiftItem(this.currentItem);
  }

  private unshiftItem(item: ItemElement): void {
    if (!item.parentNode) {
      return;
    }
    if (!isHtmlElement(item.parentNode)) {
      return;
    }

    const parentItem = item.parentNode.closest<ItemElement>(
      `.${DefaultListCssClasses.item}`,
    );

    if (!parentItem) {
      return;
    }

    let currentItemChildWrapper = getItemChildWrapper(item);

    if (item.parentElement === null) {
      return;
    }

    const siblings = getSiblings(item);

    if (siblings !== null) {
      if (currentItemChildWrapper === null) {
        currentItemChildWrapper = this.renderer.renderWrapper(false);
      }

      siblings.forEach((sibling) => {
        currentItemChildWrapper!.appendChild(sibling);
      });

      item.appendChild(currentItemChildWrapper);
    }

    parentItem.after(item);

    focusItem(item, false);

    removeChildWrapperIfEmpty(parentItem);
  }

  private splitList(item: ItemElement): void {
    const currentItemChildrenList = getChildItems(item);

    const currentBlock = this.block;

    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

    if (currentItemChildrenList.length !== 0) {
      const firstChildItem = currentItemChildrenList[0];

      this.unshiftItem(firstChildItem);

      focusItem(item, false);
    }

    if (
      item.previousElementSibling === null &&
      item.parentNode === this.listWrapper
    ) {
      this.convertItemToDefaultBlock(currentBlockIndex);

      return;
    }

    const newListItems = getSiblings(item);

    if (newListItems === null) {
      return;
    }

    const newListWrapper = this.renderer.renderWrapper(true);

    newListItems.forEach((newListItem) => {
      newListWrapper.appendChild(newListItem);
    });

    const newListContent = this.save(newListWrapper);

    (newListContent.meta as OrderedListItemMeta).start =
      this.data.style == 'ordered' ? 1 : undefined;

    this.api.blocks.insert(
      currentBlock?.name,
      newListContent,
      this.config,
      currentBlockIndex + 1,
    );

    this.convertItemToDefaultBlock(currentBlockIndex + 1);

    newListWrapper.remove();
  }

  private splitItem(currentItem: ItemElement): void {
    const [currentNode, offset] = getCaretNodeAndOffset();

    if (currentNode === null) {
      return;
    }

    const currentItemContent = getItemContentElement(currentItem);

    let endingHTML: string;

    if (currentItemContent === null) {
      endingHTML = '';
    } else {
      endingHTML = getContenteditableSlice(
        currentItemContent,
        currentNode,
        offset,
        'right',
        true,
      );
    }

    const itemChildren = getItemChildWrapper(currentItem);

    const itemEl = this.renderItem(endingHTML);

    currentItem?.after(itemEl);

    if (itemChildren) {
      itemEl.appendChild(itemChildren);
    }

    focusItem(itemEl);
  }

  private mergeItemWithPrevious(item: ItemElement): void {
    const previousItem = item.previousElementSibling;

    const currentItemParentNode = item.parentNode;

    if (currentItemParentNode === null) {
      return;
    }
    if (!isHtmlElement(currentItemParentNode)) {
      return;
    }

    const parentItem = currentItemParentNode.closest<ItemElement>(
      `.${DefaultListCssClasses.item}`,
    );

    if (!previousItem && !parentItem) {
      return;
    }

    if (previousItem && !isHtmlElement(previousItem)) {
      return;
    }

    let targetItem: ItemElement | null;

    if (previousItem) {
      const childrenOfPreviousItem = getChildItems(previousItem, false);

      if (
        childrenOfPreviousItem.length !== 0 &&
        childrenOfPreviousItem.length !== 0
      ) {
        targetItem = childrenOfPreviousItem[childrenOfPreviousItem.length - 1];
      } else {
        targetItem = previousItem;
      }
    } else {
      targetItem = parentItem;
    }

    const currentItemContent = this.renderer.getItemContent(item);

    if (!targetItem) {
      return;
    }

    focusItem(targetItem, false);

    const targetItemContentElement = getItemContentElement(targetItem);

    if (targetItemContentElement === null) {
      return;
    }

    targetItemContentElement.insertAdjacentHTML(
      'beforeend',
      currentItemContent,
    );

    const currentItemChildrenList = getChildItems(item);

    if (currentItemChildrenList.length === 0) {
      item.remove();

      removeChildWrapperIfEmpty(targetItem);

      return;
    }

    const targetForChildItems = previousItem ? previousItem : parentItem!;

    const targetChildWrapper =
      getItemChildWrapper(targetForChildItems) ??
      this.renderer.renderWrapper(false);

    if (previousItem) {
      currentItemChildrenList.forEach((childItem) => {
        targetChildWrapper.appendChild(childItem);
      });
    } else {
      currentItemChildrenList.forEach((childItem) => {
        targetChildWrapper.prepend(childItem);
      });
    }

    if (getItemChildWrapper(targetForChildItems) === null) {
      targetItem.appendChild(targetChildWrapper);
    }

    item.remove();
  }

  private addTab(event: KeyboardEvent): void {
    event.stopPropagation();

    event.preventDefault();

    const currentItem = this.currentItem;

    if (!currentItem) {
      return;
    }

    if (this.config?.maxLevel !== undefined) {
      const currentItemLevel = this.currentItemLevel;

      if (
        currentItemLevel !== null &&
        currentItemLevel === this.config.maxLevel
      ) {
        return;
      }
    }

    const prevItem = currentItem.previousSibling;

    if (prevItem === null) {
      return;
    }
    if (!isHtmlElement(prevItem)) {
      return;
    }

    const prevItemChildrenList = getItemChildWrapper(prevItem);

    if (prevItemChildrenList) {
      prevItemChildrenList.appendChild(currentItem);

      const currentItemChildrenList = getChildItems(currentItem);

      currentItemChildrenList.forEach((child) => {
        prevItemChildrenList.appendChild(child);
      });
    } else {
      const prevItemChildrenListWrapper = this.renderer.renderWrapper(false);

      prevItemChildrenListWrapper.appendChild(currentItem);

      const currentItemChildrenList = getChildItems(currentItem);

      currentItemChildrenList.forEach((child) => {
        prevItemChildrenListWrapper.appendChild(child);
      });

      prevItem.appendChild(prevItemChildrenListWrapper);
    }

    removeChildWrapperIfEmpty(currentItem);

    focusItem(currentItem, false);
  }

  private convertItemToDefaultBlock(
    newBloxkIndex?: number,
    removeList?: boolean,
  ): void {
    let newBlock;

    const currentItem = this.currentItem;

    const currentItemContent =
      currentItem !== null ? this.renderer.getItemContent(currentItem) : '';

    if (removeList === true) {
      this.api.blocks.delete();
    }

    if (newBloxkIndex !== undefined) {
      newBlock = this.api.blocks.insert(
        undefined,
        { text: currentItemContent },
        undefined,
        newBloxkIndex,
      );
    } else {
      newBlock = this.api.blocks.insert();
    }

    currentItem?.remove();
    this.api.caret.setToBlock(newBlock, 'start');
  }

  private convertFirstItemToDefaultBlock(): void {
    const currentItem = this.currentItem;

    if (currentItem === null) {
      return;
    }

    const currentItemChildren = getChildItems(currentItem);

    if (currentItemChildren.length !== 0) {
      const firstChildItem = currentItemChildren[0];

      this.unshiftItem(firstChildItem);

      focusItem(currentItem);
    }

    const currentItemSiblings = getSiblings(currentItem);

    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

    const removeList = currentItemSiblings === null;

    this.convertItemToDefaultBlock(currentBlockIndex, removeList);
  }

  private renderItem(
    itemContent: ListItem['content'],
    meta?: ListItem['meta'],
  ): ItemElement {
    const itemMeta = meta ?? this.renderer.composeDefaultMeta();

    switch (true) {
      case this.renderer instanceof OrderedListRenderer:
        return this.renderer.renderItem(
          itemContent,
          itemMeta as OrderedListItemMeta,
        );

      default:
        return this.renderer.renderItem(
          itemContent,
          itemMeta as UnorderedListItemMeta,
        );
    }
  }

  private appendItems(items: ListItem[], parentElement: Element): void {
    items.forEach((item) => {
      const itemEl = this.renderItem(item.content, item.meta);

      parentElement.appendChild(itemEl);

      if (item.items.length) {
        const sublistWrapper = this.renderer?.renderWrapper(false);

        this.appendItems(item.items, sublistWrapper);

        itemEl.appendChild(sublistWrapper);
      }
    });
  }
}
