import { PopoverDesktop } from '@repo/editor/components/utils/popover/popover-desktop';
import { PopoverInline } from '@repo/editor/components/utils/popover/popover-inline';
import { PopoverMobile } from '@repo/editor/components/utils/popover/popover-mobile';

export type Popover = PopoverDesktop | PopoverMobile | PopoverInline;

export { PopoverDesktop, PopoverMobile, PopoverInline };
