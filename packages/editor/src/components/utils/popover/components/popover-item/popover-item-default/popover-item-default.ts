import { IconDotCircle, IconChevronRight } from '@codexteam/icons';
import Dom from '@repo/editor/components/dom';
import { PopoverItem } from '@repo/editor/components/utils/popover/components/popover-item/popover-item';
import { css } from '@repo/editor/components/utils/popover/components/popover-item/popover-item-default/popover-item-default.const';
import { PopoverItemType } from '@repo/editor/types/utils/popover/popover-item-type';

import type {
  PopoverItemDefaultParams as PopoverItemDefaultParams,
  PopoverItemRenderParamsMap,
} from '@repo/editor/types/utils/popover/popover-item';

export class PopoverItemDefault extends PopoverItem {
  public get isDisabled(): boolean {
    return this.params.isDisabled === true;
  }

  public get toggle(): boolean | string | undefined {
    return this.params.toggle;
  }

  public get title(): string | undefined {
    return this.params.title;
  }

  public get isConfirmationStateEnabled(): boolean {
    return this.confirmationState !== null;
  }

  public get isFocused(): boolean {
    if (this.nodes.root === null) {
      return false;
    }

    return this.nodes.root.classList.contains(css.focused);
  }

  private nodes: {
    root: null | HTMLElement;
    icon: null | HTMLElement;
  } = {
    root: null,
    icon: null,
  };

  private confirmationState: PopoverItemDefaultParams | null = null;

  constructor(
    protected readonly params: PopoverItemDefaultParams,
    renderParams?: PopoverItemRenderParamsMap[PopoverItemType.Default],
  ) {
    super(params);

    this.nodes.root = this.make(params, renderParams);
  }

  public getElement(): HTMLElement | null {
    return this.nodes.root;
  }

  public handleClick(): void {
    if (this.isConfirmationStateEnabled && this.confirmationState !== null) {
      this.activateOrEnableConfirmationMode(this.confirmationState);

      return;
    }

    this.activateOrEnableConfirmationMode(this.params);
  }

  public toggleActive(isActive?: boolean): void {
    this.nodes.root?.classList.toggle(css.active, isActive);
  }

  public override toggleHidden(isHidden: boolean): void {
    this.nodes.root?.classList.toggle(css.hidden, isHidden);
  }

  public reset(): void {
    if (this.isConfirmationStateEnabled) {
      this.disableConfirmationMode();
    }
  }

  public onFocus(): void {
    this.disableSpecialHoverAndFocusBehavior();
  }

  private make(
    params: PopoverItemDefaultParams,
    renderParams?: PopoverItemRenderParamsMap[PopoverItemType.Default],
  ): HTMLElement {
    const tag = renderParams?.wrapperTag || 'div';
    const el = Dom.make(tag, css.container, {
      type: tag === 'button' ? 'button' : undefined,
    });

    if (params.name) {
      el.dataset.itemName = params.name;
    }

    this.nodes.icon = Dom.make('div', [css.icon, css.iconTool], {
      innerHTML: params.icon || IconDotCircle,
    });

    el.appendChild(this.nodes.icon);

    if (params.title !== undefined) {
      el.appendChild(
        Dom.make('div', css.title, {
          innerHTML: params.title || '',
        }),
      );
    }

    if (params.secondaryLabel) {
      el.appendChild(
        Dom.make('div', css.secondaryTitle, {
          textContent: params.secondaryLabel,
        }),
      );
    }

    if (this.hasChildren) {
      el.appendChild(
        Dom.make('div', [css.icon, css.iconChevronRight], {
          innerHTML: IconChevronRight,
        }),
      );
    }

    if (this.isActive) {
      el.classList.add(css.active);
    }

    if (params.isDisabled) {
      el.classList.add(css.disabled);
    }

    if (params.hint !== undefined && renderParams?.hint?.enabled !== false) {
      this.addHint(el, {
        ...params.hint,
        position: renderParams?.hint?.position || 'right',
      });
    }

    return el;
  }

  private enableConfirmationMode(newState: PopoverItemDefaultParams): void {
    if (this.nodes.root === null) {
      return;
    }

    const params = {
      ...this.params,
      ...newState,
      confirmation:
        'confirmation' in newState ? newState.confirmation : undefined,
    } as PopoverItemDefaultParams;
    const confirmationEl = this.make(params);

    this.nodes.root.innerHTML = confirmationEl.innerHTML;
    this.nodes.root.classList.add(css.confirmationState);

    this.confirmationState = newState;

    this.enableSpecialHoverAndFocusBehavior();
  }

  private disableConfirmationMode(): void {
    if (this.nodes.root === null) {
      return;
    }
    const itemWithOriginalParams = this.make(this.params);

    this.nodes.root.innerHTML = itemWithOriginalParams.innerHTML;
    this.nodes.root.classList.remove(css.confirmationState);

    this.confirmationState = null;

    this.disableSpecialHoverAndFocusBehavior();
  }

  private enableSpecialHoverAndFocusBehavior(): void {
    this.nodes.root?.classList.add(css.noHover);
    this.nodes.root?.classList.add(css.noFocus);

    this.nodes.root?.addEventListener(
      'mouseleave',
      this.removeSpecialHoverBehavior,
      { once: true },
    );
  }

  private disableSpecialHoverAndFocusBehavior(): void {
    this.removeSpecialFocusBehavior();
    this.removeSpecialHoverBehavior();

    this.nodes.root?.removeEventListener(
      'mouseleave',
      this.removeSpecialHoverBehavior,
    );
  }

  private removeSpecialFocusBehavior = (): void => {
    this.nodes.root?.classList.remove(css.noFocus);
  };

  private removeSpecialHoverBehavior = (): void => {
    this.nodes.root?.classList.remove(css.noHover);
  };

  private activateOrEnableConfirmationMode(
    item: PopoverItemDefaultParams,
  ): void {
    if (!('confirmation' in item) || item.confirmation === undefined) {
      try {
        item.onActivate?.(item);
        this.disableConfirmationMode();
      } catch {
        this.animateError();
      }
    } else {
      this.enableConfirmationMode(item.confirmation);
    }
  }

  private animateError(): void {
    if (this.nodes.icon?.classList.contains(css.wobbleAnimation)) {
      return;
    }

    this.nodes.icon?.classList.add(css.wobbleAnimation);

    this.nodes.icon?.addEventListener('animationend', this.onErrorAnimationEnd);
  }

  private onErrorAnimationEnd = (): void => {
    this.nodes.icon?.classList.remove(css.wobbleAnimation);
    this.nodes.icon?.removeEventListener(
      'animationend',
      this.onErrorAnimationEnd,
    );
  };
}
