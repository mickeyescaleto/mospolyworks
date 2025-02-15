import { PopoverDesktop } from '@/components/utils/popover/popover-desktop';
import { PopoverInline } from '@/components/utils/popover/popover-inline';
import { PopoverMobile } from '@/components/utils/popover/popover-mobile';

export type Popover = PopoverDesktop | PopoverMobile | PopoverInline;

export { PopoverDesktop, PopoverMobile, PopoverInline };
