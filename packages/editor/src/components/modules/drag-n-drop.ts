import SelectionUtils from '@/components/selection';
import Module from '@/components/__module';

export default class DragNDrop extends Module {
  private isStartedAtEditor = false;

  public toggleReadOnly(readOnlyEnabled: boolean): void {
    if (readOnlyEnabled) {
      this.disableModuleBindings();
    } else {
      this.enableModuleBindings();
    }
  }

  private enableModuleBindings(): void {
    const { UI } = this.Editor;

    this.readOnlyMutableListeners.on(
      UI.nodes.holder,
      'drop',
      async (dropEvent: DragEvent) => {
        await this.processDrop(dropEvent);
      },
      true,
    );

    this.readOnlyMutableListeners.on(UI.nodes.holder, 'dragstart', () => {
      this.processDragStart();
    });

    this.readOnlyMutableListeners.on(
      UI.nodes.holder,
      'dragover',
      (dragEvent: DragEvent) => {
        this.processDragOver(dragEvent);
      },
      true,
    );
  }

  private disableModuleBindings(): void {
    this.readOnlyMutableListeners.clearAll();
  }

  private async processDrop(dropEvent: DragEvent): Promise<void> {
    const { BlockManager, Paste, Caret } = this.Editor;

    dropEvent.preventDefault();

    BlockManager.blocks.forEach((block) => {
      block.dropTarget = false;
    });

    if (
      SelectionUtils.isAtEditor &&
      !SelectionUtils.isCollapsed &&
      this.isStartedAtEditor
    ) {
      document.execCommand('delete');
    }

    this.isStartedAtEditor = false;

    const targetBlock = BlockManager.setCurrentBlockByChildNode(
      dropEvent.target as Node,
    );

    if (targetBlock) {
      this.Editor.Caret.setToBlock(targetBlock, Caret.positions.END);
    } else {
      const lastBlock = BlockManager.setCurrentBlockByChildNode(
        BlockManager.lastBlock.holder,
      );

      this.Editor.Caret.setToBlock(lastBlock, Caret.positions.END);
    }

    await Paste.processDataTransfer(dropEvent.dataTransfer, true);
  }

  private processDragStart(): void {
    if (SelectionUtils.isAtEditor && !SelectionUtils.isCollapsed) {
      this.isStartedAtEditor = true;
    }

    this.Editor.InlineToolbar.close();
  }

  private processDragOver(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
  }
}
