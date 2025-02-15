declare global {
  type KeyboardLayoutMap = {
    get(key: string): string | undefined;
    has(key: string): boolean;
    size: number;
    entries(): IterableIterator<[string, string]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    forEach(
      callbackfn: (value: string, key: string, map: KeyboardLayoutMap) => void,
      thisArg?: unknown,
    ): void;
  };

  type Keyboard = {
    getLayoutMap(): Promise<KeyboardLayoutMap>;
  };

  interface Navigator {
    keyboard?: Keyboard;
  }
}

export async function getKeyboardKeyForCode(
  code: string,
  fallback: string,
): Promise<string> {
  const keyboard = navigator.keyboard;

  if (!keyboard) {
    return fallback;
  }

  try {
    const map = await keyboard.getLayoutMap();

    const key = map.get(code);

    return key || fallback;
  } catch (e) {
    console.error(e);

    return fallback;
  }
}
