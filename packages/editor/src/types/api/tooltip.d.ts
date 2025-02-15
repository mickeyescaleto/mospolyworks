import type { TooltipContent, TooltipOptions } from 'codex-tooltip';

export type Tooltip = {
  show(
    element: HTMLElement,
    content: TooltipContent,
    options?: TooltipOptions,
  ): void;
  hide(): void;
  onHover(
    element: HTMLElement,
    content: TooltipContent,
    options?: TooltipOptions,
  ): void;
};
