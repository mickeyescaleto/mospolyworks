import { nanoid } from 'nanoid';
import Dom from '@/components/dom';

export enum LogLevels {
  VERBOSE = 'VERBOSE',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export type ChainData = {
  data?: object;
  function: (...args: any[]) => any;
};

export const keyCodes = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  DELETE: 46,
  META: 91,
  SLASH: 191,
};

export const mouseButtons = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2,
  BACKWARD: 3,
  FORWARD: 4,
};

function _log(
  labeled: boolean,
  msg: string,
  type = 'log',
  args?: any,
  style = 'color: inherit',
): void {
  if (!('console' in window) || !window.console[type]) {
    return;
  }

  const isSimpleType = ['info', 'log', 'warn', 'error'].includes(type);
  const argsToPass = [];

  switch (_log.logLevel) {
    case LogLevels.ERROR:
      if (type !== 'error') {
        return;
      }
      break;

    case LogLevels.WARN:
      if (!['error', 'warn'].includes(type)) {
        return;
      }
      break;

    case LogLevels.INFO:
      if (!isSimpleType || labeled) {
        return;
      }
      break;
  }

  if (args) {
    argsToPass.push(args);
  }

  const editorLabelText = `Editor`;
  const editorLabelStyle = `line-height: 1em;
            color: #006FEA;
            display: inline-block;
            font-size: 11px;
            line-height: 1em;
            background-color: #fff;
            padding: 4px 9px;
            border-radius: 30px;
            border: 1px solid rgba(56, 138, 229, 0.16);
            margin: 4px 5px 4px 0;`;

  if (labeled) {
    if (isSimpleType) {
      argsToPass.unshift(editorLabelStyle, style);
      msg = `%c${editorLabelText}%c ${msg}`;
    } else {
      msg = `( ${editorLabelText} )${msg}`;
    }
  }

  try {
    if (!isSimpleType) {
      console[type](msg);
    } else if (args) {
      console[type](`${msg} %o`, ...argsToPass);
    } else {
      console[type](msg, ...argsToPass);
    }
  } catch (ignored) {}
}

_log.logLevel = LogLevels.VERBOSE;

export function setLogLevel(logLevel: LogLevels): void {
  _log.logLevel = logLevel;
}

export const log = _log.bind(window, false);

export const logLabeled = _log.bind(window, true);

export function typeOf(object: any): string {
  return Object.prototype.toString
    .call(object)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

export function isFunction(fn: any): fn is (...args: any[]) => any {
  return typeOf(fn) === 'function' || typeOf(fn) === 'asyncfunction';
}

export function isObject(v: any): v is object {
  return typeOf(v) === 'object';
}

export function isString(v: any): v is string {
  return typeOf(v) === 'string';
}

export function isBoolean(v: any): v is boolean {
  return typeOf(v) === 'boolean';
}

export function isNumber(v: any): v is number {
  return typeOf(v) === 'number';
}

export function isUndefined(v: any): v is undefined {
  return typeOf(v) === 'undefined';
}

export function isClass(fn: any): boolean {
  return isFunction(fn) && /^\s*class\s+/.test(fn.toString());
}

export function isEmpty(object: object): boolean {
  if (!object) {
    return true;
  }

  return Object.keys(object).length === 0 && object.constructor === Object;
}

export function isPromise(object: any): object is Promise<any> {
  return Promise.resolve(object) === object;
}

export function isPrintableKey(keyCode: number): boolean {
  return (
    (keyCode > 47 && keyCode < 58) ||
    keyCode === 32 ||
    keyCode === 13 ||
    keyCode === 229 ||
    (keyCode > 64 && keyCode < 91) ||
    (keyCode > 95 && keyCode < 112) ||
    (keyCode > 185 && keyCode < 193) ||
    (keyCode > 218 && keyCode < 223)
  );
}

export async function sequence(
  chains: ChainData[],
  success: (data: object) => void = (): void => {},
  fallback: (data: object) => void = (): void => {},
): Promise<void> {
  async function waitNextBlock(
    chainData: ChainData,
    successCallback: (data: object) => void,
    fallbackCallback: (data: object) => void,
  ): Promise<void> {
    try {
      await chainData.function(chainData.data);
      await successCallback(!isUndefined(chainData.data) ? chainData.data : {});
    } catch (e) {
      fallbackCallback(!isUndefined(chainData.data) ? chainData.data : {});
    }
  }

  return chains.reduce(async (previousValue, currentValue) => {
    await previousValue;

    return waitNextBlock(currentValue, success, fallback);
  }, Promise.resolve());
}

export function array(collection: ArrayLike<any>): any[] {
  return Array.prototype.slice.call(collection);
}

export function delay(method: (...args: any[]) => any, timeout: number) {
  return function (): void {
    const context = this,
      args = arguments;

    window.setTimeout(() => method.apply(context, args), timeout);
  };
}

export function getFileExtension(file: File): string {
  return file.name.split('.').pop();
}

export function isValidMimeType(type: string): boolean {
  return /^[-\w]+\/([-+\w]+|\*)$/.test(type);
}

export function debounce(
  func: (...args: unknown[]) => void,
  wait?: number,
  immediate?: boolean,
): () => void {
  let timeout;

  return (...args: unknown[]): void => {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    window.clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

export function throttle(
  func,
  wait,
  options: { leading?: boolean; trailing?: boolean } = undefined,
): () => void {
  let context, args, result;
  let timeout = null;
  let previous = 0;

  if (!options) {
    options = {};
  }

  const later = function (): void {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);

    if (!timeout) {
      context = args = null;
    }
  };

  return function (): unknown {
    const now = Date.now();

    if (!previous && options.leading === false) {
      previous = now;
    }

    const remaining = wait - (now - previous);

    context = this;

    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);

      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };
}

export function copyTextToClipboard(text): void {
  const el = Dom.make('div', 'codex-editor-clipboard', {
    innerHTML: text,
  });

  document.body.appendChild(el);

  const selection = window.getSelection();
  const range = document.createRange();

  range.selectNode(el);

  window.getSelection().removeAllRanges();
  selection.addRange(range);

  document.execCommand('copy');
  document.body.removeChild(el);
}

export function getUserOS(): { [key: string]: boolean } {
  const OS = {
    win: false,
    mac: false,
    x11: false,
    linux: false,
  };

  const userOS = Object.keys(OS).find(
    (os: string) =>
      window.navigator.appVersion.toLowerCase().indexOf(os) !== -1,
  );

  if (userOS) {
    OS[userOS] = true;

    return OS;
  }

  return OS;
}

export function capitalize(text: string): string {
  return text[0].toUpperCase() + text.slice(1);
}

export function deepMerge<T extends object>(target, ...sources): T {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

export const isTouchSupported: boolean =
  'ontouchstart' in document.documentElement;

export function beautifyShortcut(shortcut: string): string {
  const OS = getUserOS();

  shortcut = shortcut
    .replace(/shift/gi, '⇧')
    .replace(/backspace/gi, '⌫')
    .replace(/enter/gi, '⏎')
    .replace(/up/gi, '↑')
    .replace(/left/gi, '→')
    .replace(/down/gi, '↓')
    .replace(/right/gi, '←')
    .replace(/escape/gi, '⎋')
    .replace(/insert/gi, 'Ins')
    .replace(/delete/gi, '␡')
    .replace(/\+/gi, ' + ');

  if (OS.mac) {
    shortcut = shortcut.replace(/ctrl|cmd/gi, '⌘').replace(/alt/gi, '⌥');
  } else {
    shortcut = shortcut.replace(/cmd/gi, 'Ctrl').replace(/windows/gi, 'WIN');
  }

  return shortcut;
}

export function getValidUrl(url: string): string {
  try {
    const urlObject = new URL(url);

    return urlObject.href;
  } catch (e) {}

  if (url.substring(0, 2) === '//') {
    return window.location.protocol + url;
  } else {
    return window.location.origin + url;
  }
}

export function generateBlockId(): string {
  const idLen = 10;

  return nanoid(idLen);
}

export function openTab(url: string): void {
  window.open(url, '_blank');
}

export function generateId(prefix = ''): string {
  return `${prefix}${Math.floor(Math.random() * 1e8).toString(16)}`;
}

export function deprecationAssert(
  condition: boolean,
  oldProperty: string,
  newProperty: string,
): void {
  const message = `«${oldProperty}» is deprecated and will be removed in the next major release. Please use the «${newProperty}» instead.`;

  if (condition) {
    logLabeled(message, 'warn');
  }
}

export function cacheable<
  Target,
  Value,
  Arguments extends unknown[] = unknown[],
>(
  target: Target,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const propertyToOverride = descriptor.value ? 'value' : 'get';
  const originalMethod = descriptor[propertyToOverride];
  const cacheKey = `#${propertyKey}Cache`;

  descriptor[propertyToOverride] = function (...args: Arguments): Value {
    if (this[cacheKey] === undefined) {
      this[cacheKey] = originalMethod.apply(this, ...args);
    }

    return this[cacheKey];
  };

  if (propertyToOverride === 'get' && descriptor.set) {
    const originalSet = descriptor.set;

    descriptor.set = function (value: unknown): void {
      delete target[cacheKey];

      originalSet.apply(this, value);
    };
  }

  return descriptor;
}

export const mobileScreenBreakpoint = 650;

export function isMobileScreen(): boolean {
  return window.matchMedia(`(max-width: ${mobileScreenBreakpoint}px)`).matches;
}

export const isIosDevice =
  typeof window !== 'undefined' &&
  window.navigator &&
  window.navigator.platform &&
  (/iP(ad|hone|od)/.test(window.navigator.platform) ||
    (window.navigator.platform === 'MacIntel' &&
      window.navigator.maxTouchPoints > 1));

export function equals(var1: unknown, var2: unknown): boolean {
  const isVar1NonPrimitive = Array.isArray(var1) || isObject(var1);
  const isVar2NonPrimitive = Array.isArray(var2) || isObject(var2);

  if (isVar1NonPrimitive || isVar2NonPrimitive) {
    return JSON.stringify(var1) === JSON.stringify(var2);
  }

  return var1 === var2;
}
