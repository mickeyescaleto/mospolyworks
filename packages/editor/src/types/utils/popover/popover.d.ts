import { PopoverEvent } from '@repo/editor/types/utils/popover/popover-event';
import type { PopoverItemParams } from '@repo/editor/types/utils/popover/popover-item';

export type PopoverParams = {
  items: PopoverItemParams[];
  scopeElement?: HTMLElement;
  searchable?: boolean;
  flippable?: boolean;
  messages?: PopoverMessages;
  class?: string;
  nestingLevel?: number;
};

export type PopoverMessages = {
  nothingFound?: string;
  search?: string;
};

export type PopoverEventMap = {
  [PopoverEvent.Closed]: undefined;
  [PopoverEvent.ClosedOnActivate]: undefined;
};

export type PopoverNodes = {
  popover: HTMLElement;
  popoverContainer: HTMLElement;
  nothingFoundMessage: HTMLElement;
  items: HTMLElement;
};

export type PopoverMobileNodes = PopoverNodes & {
  header: HTMLElement;
  overlay: HTMLElement;
};
