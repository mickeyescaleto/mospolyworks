import { IconMenu, IconPlus } from '@codexteam/icons';
import Dom, { calculateBaseline } from '@/components/dom';
import * as utilities from '@/components/utilities';
import Module from '@/components/__module';
import I18n from '@/components/i18n';
import { I18nInternalNS } from '@/components/i18n/namespace-internal';
import * as tooltip from '@/components/utils/tooltip';
import Block from '@/components/block';
import Toolbox, { ToolboxEvent } from '@/components/ui/toolbox';
import { BlockHovered } from '@/components/events/block-hovered';
import { beautifyShortcut } from '@/components/utilities';
import { getKeyboardKeyForCode } from '@/components/utils/keyboard';

import type { ModuleConfig } from '@/types-internal/module-config';

type ToolbarNodes = {
  wrapper: HTMLElement | undefined;
  content: HTMLElement | undefined;
  actions: HTMLElement | undefined;
  plusButton: HTMLElement | undefined;
  settingsToggler: HTMLElement | undefined;
};

export default class Toolbar extends Module<ToolbarNodes> {
  private hoveredBlock: Block;

  private toolboxInstance: Toolbox | null = null;

  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });
  }

  public get CSS(): { [name: string]: string } {
    return {
      toolbar: 'ce-toolbar',
      content: 'ce-toolbar__content',
      actions: 'ce-toolbar__actions',
      actionsOpened: 'ce-toolbar__actions--opened',
      toolbarOpened: 'ce-toolbar--opened',
      openedToolboxHolderModifier: 'codex-editor--toolbox-opened',
      plusButton: 'ce-toolbar__plus',
      plusButtonShortcut: 'ce-toolbar__plus-shortcut',
      settingsToggler: 'ce-toolbar__settings-btn',
      settingsTogglerHidden: 'ce-toolbar__settings-btn--hidden',
    };
  }

  public get opened(): boolean {
    return this.nodes.wrapper.classList.contains(this.CSS.toolbarOpened);
  }

  public get toolbox(): {
    opened: boolean | undefined;
    close: () => void;
    open: () => void;
    toggle: () => void;
    hasFocus: () => boolean | undefined;
  } {
    return {
      opened: this.toolboxInstance?.opened,
      close: () => {
        this.toolboxInstance?.close();
      },
      open: () => {
        if (this.toolboxInstance === null) {
          utilities.log(
            'toolbox.open() called before initialization is finished',
            'warn',
          );

          return;
        }

        this.Editor.BlockManager.currentBlock = this.hoveredBlock;

        this.toolboxInstance.open();
      },
      toggle: () => {
        if (this.toolboxInstance === null) {
          utilities.log(
            'toolbox.toggle() called before initialization is finished',
            'warn',
          );

          return;
        }

        this.toolboxInstance.toggle();
      },
      hasFocus: () => this.toolboxInstance?.hasFocus(),
    };
  }

  private get blockActions(): { hide: () => void; show: () => void } {
    return {
      hide: (): void => {
        this.nodes.actions.classList.remove(this.CSS.actionsOpened);
      },
      show: (): void => {
        this.nodes.actions.classList.add(this.CSS.actionsOpened);
      },
    };
  }

  private get blockTunesToggler(): { hide: () => void; show: () => void } {
    return {
      hide: (): void =>
        this.nodes.settingsToggler.classList.add(
          this.CSS.settingsTogglerHidden,
        ),
      show: (): void =>
        this.nodes.settingsToggler.classList.remove(
          this.CSS.settingsTogglerHidden,
        ),
    };
  }

  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (!readOnlyEnabled) {
      window.requestIdleCallback(
        () => {
          this.drawUI();
          this.enableModuleBindings();
        },
        { timeout: 2000 },
      );
    } else {
      this.destroy();
      this.Editor.BlockSettings.destroy();
      this.disableModuleBindings();
    }
  }

  public moveAndOpen(
    block: Block = this.Editor.BlockManager.currentBlock,
  ): void {
    if (this.toolboxInstance === null) {
      utilities.log(
        "Can't open Toolbar since Editor initialization is not finished yet",
        'warn',
      );

      return;
    }

    if (this.toolboxInstance.opened) {
      this.toolboxInstance.close();
    }

    if (this.Editor.BlockSettings.opened) {
      this.Editor.BlockSettings.close();
    }

    if (!block) {
      return;
    }

    this.hoveredBlock = block;

    const targetBlockHolder = block.holder;
    const { isMobile } = this.Editor.UI;

    let toolbarY;
    const MAX_OFFSET = 20;

    const firstInput = block.firstInput;
    const targetBlockHolderRect = targetBlockHolder.getBoundingClientRect();
    const firstInputRect =
      firstInput !== undefined ? firstInput.getBoundingClientRect() : null;

    const firstInputOffset =
      firstInputRect !== null
        ? firstInputRect.top - targetBlockHolderRect.top
        : null;

    const isFirstInputFarFromTop =
      firstInputOffset !== null ? firstInputOffset > MAX_OFFSET : undefined;

    if (isMobile) {
      toolbarY = targetBlockHolder.offsetTop + targetBlockHolder.offsetHeight;
    } else if (firstInput === undefined || isFirstInputFarFromTop) {
      const pluginContentOffset = parseInt(
        window.getComputedStyle(block.pluginsContent).paddingTop,
      );

      const paddingTopBasedY =
        targetBlockHolder.offsetTop + pluginContentOffset;

      toolbarY = paddingTopBasedY;
    } else {
      const baseline = calculateBaseline(firstInput);
      const toolbarActionsHeight = parseInt(
        window.getComputedStyle(this.nodes.plusButton!).height,
        10,
      );

      const toolbarActionsPaddingBottom = 8;

      const baselineBasedY =
        targetBlockHolder.offsetTop +
        baseline -
        toolbarActionsHeight +
        toolbarActionsPaddingBottom +
        firstInputOffset!;

      toolbarY = baselineBasedY;
    }

    this.nodes.wrapper!.style.top = `${Math.floor(toolbarY)}px`;

    if (this.Editor.BlockManager.blocks.length === 1 && block.isEmpty) {
      this.blockTunesToggler.hide();
    } else {
      this.blockTunesToggler.show();
    }

    this.open();
  }

  public close(): void {
    if (this.Editor.ReadOnly.isEnabled) {
      return;
    }

    this.nodes.wrapper?.classList.remove(this.CSS.toolbarOpened);

    this.blockActions.hide();
    this.toolboxInstance?.close();
    this.Editor.BlockSettings.close();
    this.reset();
  }

  private reset(): void {
    this.nodes.wrapper.style.top = 'unset';
  }

  private open(withBlockActions = true): void {
    this.nodes.wrapper.classList.add(this.CSS.toolbarOpened);

    if (withBlockActions) {
      this.blockActions.show();
    } else {
      this.blockActions.hide();
    }
  }

  private async make(): Promise<void> {
    this.nodes.wrapper = Dom.make('div', this.CSS.toolbar);

    ['content', 'actions'].forEach((el) => {
      this.nodes[el] = Dom.make('div', this.CSS[el]);
    });

    Dom.append(this.nodes.wrapper, this.nodes.content);
    Dom.append(this.nodes.content, this.nodes.actions);

    this.nodes.plusButton = Dom.make('div', this.CSS.plusButton, {
      innerHTML: IconPlus,
    });
    Dom.append(this.nodes.actions, this.nodes.plusButton);

    this.readOnlyMutableListeners.on(
      this.nodes.plusButton,
      'click',
      () => {
        tooltip.hide(true);
        this.plusButtonClicked();
      },
      false,
    );

    const tooltipContent = Dom.make('div');

    tooltipContent.appendChild(
      document.createTextNode(
        I18n.ui(I18nInternalNS.ui.toolbar.toolbox, 'Add'),
      ),
    );
    tooltipContent.appendChild(
      Dom.make('div', this.CSS.plusButtonShortcut, {
        textContent: '/',
      }),
    );

    tooltip.onHover(this.nodes.plusButton, tooltipContent, {
      hidingDelay: 400,
    });

    this.nodes.settingsToggler = Dom.make('span', this.CSS.settingsToggler, {
      innerHTML: IconMenu,
    });

    Dom.append(this.nodes.actions, this.nodes.settingsToggler);

    const blockTunesTooltip = Dom.make('div');
    const blockTunesTooltipEl = Dom.text(
      I18n.ui(I18nInternalNS.ui.blockTunes.toggler, 'Click to tune'),
    );
    const slashRealKey = await getKeyboardKeyForCode('Slash', '/');

    blockTunesTooltip.appendChild(blockTunesTooltipEl);
    blockTunesTooltip.appendChild(
      Dom.make('div', this.CSS.plusButtonShortcut, {
        textContent: beautifyShortcut(`CMD + ${slashRealKey}`),
      }),
    );

    tooltip.onHover(this.nodes.settingsToggler, blockTunesTooltip, {
      hidingDelay: 400,
    });

    Dom.append(this.nodes.actions, this.makeToolbox());
    Dom.append(this.nodes.actions, this.Editor.BlockSettings.getElement());

    Dom.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }

  private makeToolbox(): Element {
    this.toolboxInstance = new Toolbox({
      api: this.Editor.API.methods,
      tools: this.Editor.Tools.blockTools,
      i18nLabels: {
        filter: I18n.ui(I18nInternalNS.ui.popover, 'Filter'),
        nothingFound: I18n.ui(I18nInternalNS.ui.popover, 'Nothing found'),
      },
    });

    this.toolboxInstance.on(ToolboxEvent.Opened, () => {
      this.Editor.UI.nodes.wrapper.classList.add(
        this.CSS.openedToolboxHolderModifier,
      );
    });

    this.toolboxInstance.on(ToolboxEvent.Closed, () => {
      this.Editor.UI.nodes.wrapper.classList.remove(
        this.CSS.openedToolboxHolderModifier,
      );
    });

    this.toolboxInstance.on(ToolboxEvent.BlockAdded, ({ block }) => {
      const { BlockManager, Caret } = this.Editor;
      const newBlock = BlockManager.getBlockById(block.id);

      if (newBlock.inputs.length === 0) {
        if (newBlock === BlockManager.lastBlock) {
          BlockManager.insertAtEnd();
          Caret.setToBlock(BlockManager.lastBlock);
        } else {
          Caret.setToBlock(BlockManager.nextBlock);
        }
      }
    });

    return this.toolboxInstance.getElement();
  }

  private plusButtonClicked(): void {
    this.Editor.BlockManager.currentBlock = this.hoveredBlock;
    this.toolboxInstance?.toggle();
  }

  private enableModuleBindings(): void {
    this.readOnlyMutableListeners.on(
      this.nodes.settingsToggler,
      'mousedown',
      (e) => {
        e.stopPropagation();

        this.settingsTogglerClicked();

        if (this.toolboxInstance?.opened) {
          this.toolboxInstance.close();
        }

        tooltip.hide(true);
      },
      true,
    );

    if (!utilities.isMobileScreen()) {
      this.eventsDispatcher.on(BlockHovered, (data) => {
        if (this.Editor.BlockSettings.opened || this.toolboxInstance?.opened) {
          return;
        }

        this.moveAndOpen(data.block);
      });
    }
  }

  private disableModuleBindings(): void {
    this.readOnlyMutableListeners.clearAll();
  }

  private settingsTogglerClicked(): void {
    this.Editor.BlockManager.currentBlock = this.hoveredBlock;

    if (this.Editor.BlockSettings.opened) {
      this.Editor.BlockSettings.close();
    } else {
      this.Editor.BlockSettings.open(this.hoveredBlock);
    }
  }

  private drawUI(): void {
    this.Editor.BlockSettings.make();
    void this.make();
  }

  private destroy(): void {
    this.removeAllNodes();
    if (this.toolboxInstance) {
      this.toolboxInstance.destroy();
    }
  }
}
