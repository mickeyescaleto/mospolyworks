import { bem } from '@repo/editor/components/utils/bem';

const className = bem('ce-popover-item-html');

export const css = {
  root: className(),
  hidden: className(null, 'hidden'),
};
