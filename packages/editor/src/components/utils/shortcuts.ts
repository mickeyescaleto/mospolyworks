import Shortcut from '@codexteam/shortcuts';

export type ShortcutData = {
  name: string;
  handler(event): void;
  on: HTMLElement | Document;
};

class Shortcuts {
  private registeredShortcuts: Map<Element, Shortcut[]> = new Map();

  public add(shortcut: ShortcutData): void {
    const foundShortcut = this.findShortcut(shortcut.on, shortcut.name);

    if (foundShortcut) {
      throw Error(
        `Shortcut ${shortcut.name} is already registered for ${shortcut.on}. Please remove it before add a new handler.`,
      );
    }

    const newShortcut = new Shortcut({
      name: shortcut.name,
      on: shortcut.on,
      callback: shortcut.handler,
    });
    const shortcuts = this.registeredShortcuts.get(shortcut.on) || [];

    this.registeredShortcuts.set(shortcut.on, [...shortcuts, newShortcut]);
  }

  public remove(element: Element, name: string): void {
    const shortcut = this.findShortcut(element, name);

    if (!shortcut) {
      return;
    }

    shortcut.remove();

    const shortcuts = this.registeredShortcuts.get(element);

    const filteredShortcuts = shortcuts.filter((el) => el !== shortcut);

    if (filteredShortcuts.length === 0) {
      this.registeredShortcuts.delete(element);

      return;
    }

    this.registeredShortcuts.set(element, filteredShortcuts);
  }

  private findShortcut(element: Element, shortcut: string): Shortcut | void {
    const shortcuts = this.registeredShortcuts.get(element) || [];

    return shortcuts.find(({ name }) => name === shortcut);
  }
}

export default new Shortcuts();
