import CodeXTooltips from 'codex-tooltip';

import type { TooltipOptions, TooltipContent } from 'codex-tooltip/types';

let lib: null | CodeXTooltips = null;

function prepare(): void {
  if (lib) {
    return;
  }

  lib = new CodeXTooltips();
}

export function show(
  element: HTMLElement,
  content: TooltipContent,
  options?: TooltipOptions,
): void {
  prepare();

  lib?.show(element, content, options);
}

export function hide(skipHidingDelay = false): void {
  prepare();

  lib?.hide(skipHidingDelay);
}

export function onHover(
  element: HTMLElement,
  content: TooltipContent,
  options?: TooltipOptions,
): void {
  prepare();

  lib?.onHover(element, content, options);
}

export function destroy(): void {
  lib?.destroy();
  lib = null;
}
