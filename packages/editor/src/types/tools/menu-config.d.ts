import type {
  PopoverItemDefaultBaseParams,
  PopoverItemHtmlParams,
  PopoverItemSeparatorParams,
  WithChildren,
} from '@repo/editor/types/utils/popover/popover-item';

export type MenuConfig = MenuConfigItem | MenuConfigItem[];

type MenuConfigDefaultBaseParams = PopoverItemDefaultBaseParams & {
  label?: string;
};

type MenuConfigItemDefaultWithConfirmationParams = Omit<
  MenuConfigDefaultBaseParams,
  'onActivate'
> & {
  onActivate?: never;
  confirmation: MenuConfigDefaultBaseParams;
};

type MenuConfigItemDefaultParams =
  | MenuConfigItemDefaultWithConfirmationParams
  | MenuConfigDefaultBaseParams
  | WithChildren<MenuConfigDefaultBaseParams>;

export type MenuConfigItem =
  | MenuConfigItemDefaultParams
  | PopoverItemSeparatorParams
  | PopoverItemHtmlParams
  | WithChildren<PopoverItemHtmlParams>;
