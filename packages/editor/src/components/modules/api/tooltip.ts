import type { TooltipOptions, TooltipContent } from 'codex-tooltip/types';
import Module from '@/components/__module';
import * as tooltip from '@/components/utils/tooltip';

import type { ModuleConfig } from '@/types-internal/module-config';
import type { Tooltip as ITooltip } from '@/types/api/tooltip';

export default class TooltipAPI extends Module {
  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });
  }

  public get methods(): ITooltip {
    return {
      show: (
        element: HTMLElement,
        content: TooltipContent,
        options?: TooltipOptions,
      ): void => this.show(element, content, options),
      hide: (): void => this.hide(),
      onHover: (
        element: HTMLElement,
        content: TooltipContent,
        options?: TooltipOptions,
      ): void => this.onHover(element, content, options),
    };
  }

  public show(
    element: HTMLElement,
    content: TooltipContent,
    options?: TooltipOptions,
  ): void {
    tooltip.show(element, content, options);
  }

  public hide(): void {
    tooltip.hide();
  }

  public onHover(
    element: HTMLElement,
    content: TooltipContent,
    options?: TooltipOptions,
  ): void {
    tooltip.onHover(element, content, options);
  }
}
