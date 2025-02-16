import Module from '@repo/editor/components/__module';
import Dom from '@repo/editor/components/dom';
import * as utilities from '@repo/editor/components/utilities';
import type Block from '@repo/editor/components/block';
import { clean, sanitizeBlocks } from '@repo/editor/components/utils/sanitizer';
import type BlockToolAdapter from '@repo/editor/components/tools/block';

import type { SavedData } from '@repo/editor/types/data-formats/block-data';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';
import type { SanitizerRule } from '@repo/editor/types/configs/sanitizer-config';
import type {
  PasteEvent,
  PasteEventDetail,
} from '@repo/editor/types/tools/paste-events';
import type { BlockAPI } from '@repo/editor/types/api/block';

type TagSubstitute = {
  tool: BlockToolAdapter;
  sanitizationConfig?: SanitizerRule;
};

type PatternSubstitute = {
  key: string;
  pattern: RegExp;
  tool: BlockToolAdapter;
};

type FilesSubstitution = {
  extensions: string[];
  mimeTypes: string[];
};

type PasteData = {
  tool: string;
  content: HTMLElement;
  event: PasteEvent;
  isBlock: boolean;
};

export default class Paste extends Module {
  public static readonly PATTERN_PROCESSING_MAX_LENGTH = 450;

  public readonly MIME_TYPE = 'application/x-editor';

  private toolsTags: { [tag: string]: TagSubstitute } = {};

  private tagsByTool: { [tools: string]: string[] } = {};

  private toolsPatterns: PatternSubstitute[] = [];

  private toolsFiles: {
    [tool: string]: FilesSubstitution;
  } = {};

  private exceptionList: string[] = [];

  public async prepare(): Promise<void> {
    this.processTools();
  }

  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      this.setCallback();
    } else {
      this.unsetCallback();
    }
  }

  public async processDataTransfer(
    dataTransfer: DataTransfer,
    isDragNDrop = false,
  ): Promise<void> {
    const { Tools } = this.Editor;
    const types = dataTransfer.types;

    const includesFiles = types.includes
      ? types.includes('Files')
      : (types as any).contains('Files');

    if (includesFiles && !utilities.isEmpty(this.toolsFiles)) {
      await this.processFiles(dataTransfer.files);

      return;
    }

    const editorData = dataTransfer.getData(this.MIME_TYPE);
    const plainData = dataTransfer.getData('text/plain');
    let htmlData = dataTransfer.getData('text/html');

    if (editorData) {
      try {
        this.insertEditorData(JSON.parse(editorData));

        return;
      } catch (error) {}
    }

    if (isDragNDrop && plainData.trim() && htmlData.trim()) {
      htmlData = '<p>' + (htmlData.trim() ? htmlData : plainData) + '</p>';
    }

    const toolsTags = Object.keys(this.toolsTags).reduce((result, tag) => {
      result[tag.toLowerCase()] = this.toolsTags[tag].sanitizationConfig ?? {};

      return result;
    }, {});

    const customConfig = Object.assign(
      {},
      toolsTags,
      Tools.getAllInlineToolsSanitizeConfig(),
      { br: {} },
    );
    const cleanData = clean(htmlData, customConfig);

    if (
      !cleanData.trim() ||
      cleanData.trim() === plainData ||
      !Dom.isHTMLString(cleanData)
    ) {
      await this.processText(plainData);
    } else {
      await this.processText(cleanData, true);
    }
  }

  public async processText(data: string, isHTML = false): Promise<void> {
    const { Caret, BlockManager } = this.Editor;
    const dataToInsert = isHTML
      ? this.processHTML(data)
      : this.processPlain(data);

    if (!dataToInsert.length) {
      return;
    }

    if (dataToInsert.length === 1) {
      if (!dataToInsert[0].isBlock) {
        this.processInlinePaste(dataToInsert.pop());
      } else {
        this.processSingleBlock(dataToInsert.pop());
      }

      return;
    }

    const isCurrentBlockDefault =
      BlockManager.currentBlock && BlockManager.currentBlock.tool.isDefault;
    const needToReplaceCurrentBlock =
      isCurrentBlockDefault && BlockManager.currentBlock.isEmpty;

    dataToInsert.map(async (content, i) =>
      this.insertBlock(content, i === 0 && needToReplaceCurrentBlock),
    );

    if (BlockManager.currentBlock) {
      Caret.setToBlock(BlockManager.currentBlock, Caret.positions.END);
    }
  }

  private setCallback(): void {
    this.listeners.on(
      this.Editor.UI.nodes.holder,
      'paste',
      this.handlePasteEvent,
    );
  }

  private unsetCallback(): void {
    this.listeners.off(
      this.Editor.UI.nodes.holder,
      'paste',
      this.handlePasteEvent,
    );
  }

  private processTools(): void {
    const tools = this.Editor.Tools.blockTools;

    Array.from(tools.values()).forEach(this.processTool);
  }

  private processTool = (tool: BlockToolAdapter): void => {
    try {
      const toolInstance = tool.create({}, {} as BlockAPI, false);

      if (tool.pasteConfig === false) {
        this.exceptionList.push(tool.name);

        return;
      }

      if (!utilities.isFunction(toolInstance.onPaste)) {
        return;
      }

      this.getTagsConfig(tool);
      this.getFilesConfig(tool);
      this.getPatternsConfig(tool);
    } catch (e) {
      utilities.log(
        `Paste handling for «${tool.name}» Tool hasn't been set up because of the error`,
        'warn',
        e,
      );
    }
  };

  private collectTagNames(
    tagOrSanitizeConfig: string | SanitizerConfig,
  ): string[] {
    if (utilities.isString(tagOrSanitizeConfig)) {
      return [tagOrSanitizeConfig];
    }

    if (utilities.isObject(tagOrSanitizeConfig)) {
      return Object.keys(tagOrSanitizeConfig);
    }

    return [];
  }

  private getTagsConfig(tool: BlockToolAdapter): void {
    if (tool.pasteConfig === false) {
      return;
    }

    const tagsOrSanitizeConfigs = tool.pasteConfig.tags || [];
    const toolTags = [];

    tagsOrSanitizeConfigs.forEach((tagOrSanitizeConfig) => {
      const tags = this.collectTagNames(tagOrSanitizeConfig);

      toolTags.push(...tags);
      tags.forEach((tag) => {
        if (Object.prototype.hasOwnProperty.call(this.toolsTags, tag)) {
          utilities.log(
            `Paste handler for «${tool.name}» Tool on «${tag}» tag is skipped ` +
              `because it is already used by «${this.toolsTags[tag].tool.name}» Tool.`,
            'warn',
          );

          return;
        }

        const sanitizationConfig = utilities.isObject(tagOrSanitizeConfig)
          ? tagOrSanitizeConfig[tag]
          : null;

        this.toolsTags[tag.toUpperCase()] = {
          tool,
          sanitizationConfig,
        };
      });
    });

    this.tagsByTool[tool.name] = toolTags.map((t) => t.toUpperCase());
  }

  private getFilesConfig(tool: BlockToolAdapter): void {
    if (tool.pasteConfig === false) {
      return;
    }

    const { files = {} } = tool.pasteConfig;
    let { extensions, mimeTypes } = files;

    if (!extensions && !mimeTypes) {
      return;
    }

    if (extensions && !Array.isArray(extensions)) {
      utilities.log(
        `«extensions» property of the onDrop config for «${tool.name}» Tool should be an array`,
      );
      extensions = [];
    }

    if (mimeTypes && !Array.isArray(mimeTypes)) {
      utilities.log(
        `«mimeTypes» property of the onDrop config for «${tool.name}» Tool should be an array`,
      );
      mimeTypes = [];
    }

    if (mimeTypes) {
      mimeTypes = mimeTypes.filter((type) => {
        if (!utilities.isValidMimeType(type)) {
          utilities.log(
            `MIME type value «${type}» for the «${tool.name}» Tool is not a valid MIME type`,
            'warn',
          );

          return false;
        }

        return true;
      });
    }

    this.toolsFiles[tool.name] = {
      extensions: extensions || [],
      mimeTypes: mimeTypes || [],
    };
  }

  private getPatternsConfig(tool: BlockToolAdapter): void {
    if (
      tool.pasteConfig === false ||
      !tool.pasteConfig.patterns ||
      utilities.isEmpty(tool.pasteConfig.patterns)
    ) {
      return;
    }

    Object.entries(tool.pasteConfig.patterns).forEach(
      ([key, pattern]: [string, RegExp]) => {
        if (!(pattern instanceof RegExp)) {
          utilities.log(
            `Pattern ${pattern} for «${tool.name}» Tool is skipped because it should be a Regexp instance.`,
            'warn',
          );
        }

        this.toolsPatterns.push({
          key,
          pattern,
          tool,
        });
      },
    );
  }

  private isNativeBehaviour(element: EventTarget): boolean {
    return Dom.isNativeInput(element);
  }

  private handlePasteEvent = async (event: ClipboardEvent): Promise<void> => {
    const { BlockManager, Toolbar } = this.Editor;

    const currentBlock = BlockManager.setCurrentBlockByChildNode(
      event.target as HTMLElement,
    );

    if (
      !currentBlock ||
      (this.isNativeBehaviour(event.target) &&
        !event.clipboardData.types.includes('Files'))
    ) {
      return;
    }

    if (currentBlock && this.exceptionList.includes(currentBlock.name)) {
      return;
    }

    event.preventDefault();
    this.processDataTransfer(event.clipboardData);

    Toolbar.close();
  };

  private async processFiles(items: FileList): Promise<void> {
    const { BlockManager } = this.Editor;

    let dataToInsert: { type: string; event: PasteEvent }[];

    dataToInsert = await Promise.all(
      Array.from(items).map((item) => this.processFile(item)),
    );
    dataToInsert = dataToInsert.filter((data) => !!data);

    const isCurrentBlockDefault = BlockManager.currentBlock.tool.isDefault;
    const needToReplaceCurrentBlock =
      isCurrentBlockDefault && BlockManager.currentBlock.isEmpty;

    dataToInsert.forEach((data, i) => {
      BlockManager.paste(
        data.type,
        data.event,
        i === 0 && needToReplaceCurrentBlock,
      );
    });
  }

  private async processFile(
    file: File,
  ): Promise<{ event: PasteEvent; type: string }> {
    const extension = utilities.getFileExtension(file);

    const foundConfig = Object.entries(this.toolsFiles).find(
      ([toolName, { mimeTypes, extensions }]) => {
        const [fileType, fileSubtype] = file.type.split('/');

        const foundExt = extensions.find(
          (ext) => ext.toLowerCase() === extension.toLowerCase(),
        );
        const foundMimeType = mimeTypes.find((mime) => {
          const [type, subtype] = mime.split('/');

          return (
            type === fileType && (subtype === fileSubtype || subtype === '*')
          );
        });

        return !!foundExt || !!foundMimeType;
      },
    );

    if (!foundConfig) {
      return;
    }

    const [tool] = foundConfig;
    const pasteEvent = this.composePasteEvent('file', {
      file,
    });

    return {
      event: pasteEvent,
      type: tool,
    };
  }

  private processHTML(innerHTML: string): PasteData[] {
    const { Tools } = this.Editor;

    const wrapper = Dom.make('DIV');

    wrapper.innerHTML = innerHTML;

    const nodes = this.getNodes(wrapper);

    return nodes
      .map((node) => {
        let content,
          tool = Tools.defaultTool,
          isBlock = false;

        switch (node.nodeType) {
          case Node.DOCUMENT_FRAGMENT_NODE:
            content = Dom.make('div');
            content.appendChild(node);
            break;

          case Node.ELEMENT_NODE:
            content = node as HTMLElement;
            isBlock = true;

            if (this.toolsTags[content.tagName]) {
              tool = this.toolsTags[content.tagName].tool;
            }
            break;
        }

        const { tags: tagsOrSanitizeConfigs } = tool.pasteConfig || {
          tags: [],
        };

        const toolTags = tagsOrSanitizeConfigs.reduce(
          (result, tagOrSanitizeConfig) => {
            const tags = this.collectTagNames(tagOrSanitizeConfig);

            tags.forEach((tag) => {
              const sanitizationConfig = utilities.isObject(tagOrSanitizeConfig)
                ? tagOrSanitizeConfig[tag]
                : null;

              result[tag.toLowerCase()] = sanitizationConfig || {};
            });

            return result;
          },
          {},
        );

        const customConfig = Object.assign(
          {},
          toolTags,
          tool.baseSanitizeConfig,
        );

        if (content.tagName.toLowerCase() === 'table') {
          const cleanTableHTML = clean(content.outerHTML, customConfig);
          const tmpWrapper = Dom.make('div', undefined, {
            innerHTML: cleanTableHTML,
          });

          content = tmpWrapper.firstChild;
        } else {
          content.innerHTML = clean(content.innerHTML, customConfig);
        }

        const event = this.composePasteEvent('tag', {
          data: content,
        });

        return {
          content,
          isBlock,
          tool: tool.name,
          event,
        };
      })
      .filter((data) => {
        const isEmpty = Dom.isEmpty(data.content);
        const isSingleTag = Dom.isSingleTag(data.content);

        return !isEmpty || isSingleTag;
      });
  }

  private processPlain(plain: string): PasteData[] {
    const { defaultBlock } = this.config as { defaultBlock: string };

    if (!plain) {
      return [];
    }

    const tool = defaultBlock;

    return plain
      .split(/\r?\n/)
      .filter((text) => text.trim())
      .map((text) => {
        const content = Dom.make('div');

        content.textContent = text;

        const event = this.composePasteEvent('tag', {
          data: content,
        });

        return {
          content,
          tool,
          isBlock: false,
          event,
        };
      });
  }

  private async processSingleBlock(dataToInsert: PasteData): Promise<void> {
    const { Caret, BlockManager } = this.Editor;
    const { currentBlock } = BlockManager;

    if (
      !currentBlock ||
      dataToInsert.tool !== currentBlock.name ||
      !Dom.containsOnlyInlineElements(dataToInsert.content.innerHTML)
    ) {
      this.insertBlock(
        dataToInsert,
        currentBlock?.tool.isDefault && currentBlock.isEmpty,
      );

      return;
    }

    Caret.insertContentAtCaretPosition(dataToInsert.content.innerHTML);
  }

  private async processInlinePaste(dataToInsert: PasteData): Promise<void> {
    const { BlockManager, Caret } = this.Editor;
    const { content } = dataToInsert;

    const currentBlockIsDefault =
      BlockManager.currentBlock && BlockManager.currentBlock.tool.isDefault;

    if (
      currentBlockIsDefault &&
      content.textContent.length < Paste.PATTERN_PROCESSING_MAX_LENGTH
    ) {
      const blockData = await this.processPattern(content.textContent);

      if (blockData) {
        const needToReplaceCurrentBlock =
          BlockManager.currentBlock &&
          BlockManager.currentBlock.tool.isDefault &&
          BlockManager.currentBlock.isEmpty;

        const insertedBlock = BlockManager.paste(
          blockData.tool,
          blockData.event,
          needToReplaceCurrentBlock,
        );

        Caret.setToBlock(insertedBlock, Caret.positions.END);

        return;
      }
    }

    if (BlockManager.currentBlock && BlockManager.currentBlock.currentInput) {
      const currentToolSanitizeConfig =
        BlockManager.currentBlock.tool.baseSanitizeConfig;

      document.execCommand(
        'insertHTML',
        false,
        clean(content.innerHTML, currentToolSanitizeConfig),
      );
    } else {
      this.insertBlock(dataToInsert);
    }
  }

  private async processPattern(
    text: string,
  ): Promise<{ event: PasteEvent; tool: string }> {
    const pattern = this.toolsPatterns.find((substitute) => {
      const execResult = substitute.pattern.exec(text);

      if (!execResult) {
        return false;
      }

      return text === execResult.shift();
    });

    if (!pattern) {
      return;
    }

    const event = this.composePasteEvent('pattern', {
      key: pattern.key,
      data: text,
    });

    return {
      event,
      tool: pattern.tool.name,
    };
  }

  private insertBlock(data: PasteData, canReplaceCurrentBlock = false): void {
    const { BlockManager, Caret } = this.Editor;
    const { currentBlock } = BlockManager;
    let block: Block;

    if (canReplaceCurrentBlock && currentBlock && currentBlock.isEmpty) {
      block = BlockManager.paste(data.tool, data.event, true);
      Caret.setToBlock(block, Caret.positions.END);

      return;
    }

    block = BlockManager.paste(data.tool, data.event);

    Caret.setToBlock(block, Caret.positions.END);
  }

  private insertEditorData(
    blocks: Pick<SavedData, 'id' | 'data' | 'tool'>[],
  ): void {
    const { BlockManager, Caret, Tools } = this.Editor;
    const sanitizedBlocks = sanitizeBlocks(
      blocks,
      (name) => Tools.blockTools.get(name).sanitizeConfig,
    );

    sanitizedBlocks.forEach(({ tool, data }, i) => {
      let needToReplaceCurrentBlock = false;

      if (i === 0) {
        const isCurrentBlockDefault =
          BlockManager.currentBlock && BlockManager.currentBlock.tool.isDefault;

        needToReplaceCurrentBlock =
          isCurrentBlockDefault && BlockManager.currentBlock.isEmpty;
      }

      const block = BlockManager.insert({
        tool,
        data,
        replace: needToReplaceCurrentBlock,
      });

      Caret.setToBlock(block, Caret.positions.END);
    });
  }

  private processElementNode(
    node: Node,
    nodes: Node[],
    destNode: Node,
  ): Node[] | void {
    const tags = Object.keys(this.toolsTags);

    const element = node as HTMLElement;

    const { tool } = this.toolsTags[element.tagName] || {};
    const toolTags = this.tagsByTool[tool?.name] || [];

    const isSubstitutable = tags.includes(element.tagName);
    const isBlockElement = Dom.blockElements.includes(
      element.tagName.toLowerCase(),
    );
    const containsAnotherToolTags = Array.from(element.children).some(
      ({ tagName }) => tags.includes(tagName) && !toolTags.includes(tagName),
    );

    const containsBlockElements = Array.from(element.children).some(
      ({ tagName }) => Dom.blockElements.includes(tagName.toLowerCase()),
    );

    if (!isBlockElement && !isSubstitutable && !containsAnotherToolTags) {
      destNode.appendChild(element);

      return [...nodes, destNode];
    }

    if (
      (isSubstitutable && !containsAnotherToolTags) ||
      (isBlockElement && !containsBlockElements && !containsAnotherToolTags)
    ) {
      return [...nodes, destNode, element];
    }
  }

  private getNodes(wrapper: Node): Node[] {
    const children = Array.from(wrapper.childNodes);
    let elementNodeProcessingResult: Node[] | void;

    const reducer = (nodes: Node[], node: Node): Node[] => {
      if (Dom.isEmpty(node) && !Dom.isSingleTag(node as HTMLElement)) {
        return nodes;
      }

      const lastNode = nodes[nodes.length - 1];

      let destNode: Node = new DocumentFragment();

      if (lastNode && Dom.isFragment(lastNode)) {
        destNode = nodes.pop();
      }

      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          elementNodeProcessingResult = this.processElementNode(
            node,
            nodes,
            destNode,
          );

          if (elementNodeProcessingResult) {
            return elementNodeProcessingResult;
          }
          break;

        case Node.TEXT_NODE:
          destNode.appendChild(node);

          return [...nodes, destNode];

        default:
          return [...nodes, destNode];
      }

      return [...nodes, ...Array.from(node.childNodes).reduce(reducer, [])];
    };

    return children.reduce(reducer, []);
  }

  private composePasteEvent(
    type: string,
    detail: PasteEventDetail,
  ): PasteEvent {
    return new CustomEvent(type, {
      detail,
    }) as PasteEvent;
  }
}
