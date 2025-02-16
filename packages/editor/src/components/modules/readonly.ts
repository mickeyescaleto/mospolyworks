import Module from '@repo/editor/components/__module';
import { CriticalError } from '@repo/editor/components/errors/critical';

export default class ReadOnly extends Module {
  private toolsDontSupportReadOnly: string[] = [];

  private readOnlyEnabled = false;

  public get isEnabled(): boolean {
    return this.readOnlyEnabled;
  }

  public async prepare(): Promise<void> {
    const { Tools } = this.Editor;
    const { blockTools } = Tools;
    const toolsDontSupportReadOnly: string[] = [];

    Array.from(blockTools.entries()).forEach(([name, tool]) => {
      if (!tool.isReadOnlySupported) {
        toolsDontSupportReadOnly.push(name);
      }
    });

    this.toolsDontSupportReadOnly = toolsDontSupportReadOnly;

    if (this.config.readOnly && toolsDontSupportReadOnly.length > 0) {
      this.throwCriticalError();
    }

    this.toggle(this.config.readOnly, true);
  }

  public async toggle(
    state = !this.readOnlyEnabled,
    isInitial = false,
  ): Promise<boolean> {
    if (state && this.toolsDontSupportReadOnly.length > 0) {
      this.throwCriticalError();
    }

    const oldState = this.readOnlyEnabled;

    this.readOnlyEnabled = state;

    for (const name in this.Editor) {
      if (!this.Editor[name].toggleReadOnly) {
        continue;
      }

      this.Editor[name].toggleReadOnly(state);
    }

    if (oldState === state) {
      return this.readOnlyEnabled;
    }

    if (isInitial) {
      return this.readOnlyEnabled;
    }

    this.Editor.ModificationsObserver.disable();

    const savedBlocks = await this.Editor.Saver.save();

    await this.Editor.BlockManager.clear();
    await this.Editor.Renderer.render(savedBlocks.blocks);

    this.Editor.ModificationsObserver.enable();

    return this.readOnlyEnabled;
  }

  private throwCriticalError(): never {
    throw new CriticalError(
      `To enable read-only mode all connected tools should support it. Tools ${this.toolsDontSupportReadOnly.join(
        ', ',
      )} don't support read-only mode.`,
    );
  }
}
