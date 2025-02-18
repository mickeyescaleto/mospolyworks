import { bem } from '@repo/editor/components/utils/bem';

const className = bem('ce-popover-item-separator');

export const css = {
  container: className(),
  line: className('line'),
  hidden: className(null, 'hidden'),
};
