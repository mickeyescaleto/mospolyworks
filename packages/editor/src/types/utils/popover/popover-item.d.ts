import { PopoverItemType } from '@repo/editor/types/utils/popover/popover-item-type';
import type {
  HintParams,
  HintPosition,
  HintTextAlignment,
} from '@repo/editor/types/utils/popover/hint';

export type PopoverItemChildren = {
  searchable?: boolean;
  isOpen?: boolean;
  isFlippable?: boolean;
  items?: PopoverItemParams[];
  onOpen?(): void;
  onClose?(): void;
};

export type WithChildren<T> = Omit<T, 'onActivate'> & {
  children: PopoverItemChildren;
  onActivate?: never;
};

export type PopoverItemDefaultWithConfirmationParams = Omit<
  PopoverItemDefaultBaseParams,
  'onActivate'
> & {
  confirmation: PopoverItemDefaultBaseParams;
  onActivate?: never;
};

export type PopoverItemSeparatorParams = {
  type: PopoverItemType.Separator;
};

export type PopoverItemHtmlParams = {
  type: PopoverItemType.Html;
  element: HTMLElement;
  hint?: HintParams;
  closeOnActivate?: boolean;
  name?: string;
};

export type PopoverItemDefaultBaseParams = {
  type?: PopoverItemType.Default;
  title?: string;
  icon?: string;
  secondaryLabel?: string;
  isActive?: boolean | (() => boolean);
  isDisabled?: boolean;
  closeOnActivate?: boolean;
  name?: string;
  toggle?: boolean | string;
  hint?: HintParams;
  onActivate(item: PopoverItemParams, event?: PointerEvent): void;
};

export type PopoverItemDefaultParams =
  | PopoverItemDefaultBaseParams
  | PopoverItemDefaultWithConfirmationParams
  | WithChildren<PopoverItemDefaultBaseParams>;

export type PopoverItemParams =
  | PopoverItemDefaultParams
  | PopoverItemSeparatorParams
  | PopoverItemHtmlParams
  | WithChildren<PopoverItemHtmlParams>;

type PopoverItemHintRenderParams = {
  position?: HintPosition;
  alignment?: HintTextAlignment;
  enabled?: boolean;
};

export type PopoverItemRenderParamsMap = {
  [PopoverItemType.Default]?: {
    wrapperTag?: 'div' | 'button';
    hint?: PopoverItemHintRenderParams;
  };

  [PopoverItemType.Html]?: {
    hint?: PopoverItemHintRenderParams;
  };
};
