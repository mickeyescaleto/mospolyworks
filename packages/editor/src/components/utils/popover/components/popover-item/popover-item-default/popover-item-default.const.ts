import { bem } from '@repo/editor/components/utils/bem';

const className = bem('editor-popover-item');

export const css = {
  container: className(),
  active: className(null, 'active'),
  disabled: className(null, 'disabled'),
  focused: className(null, 'focused'),
  hidden: className(null, 'hidden'),
  confirmationState: className(null, 'confirmation'),
  noHover: className(null, 'no-hover'),
  noFocus: className(null, 'no-focus'),
  title: className('title'),
  secondaryTitle: className('secondary-title'),
  icon: className('icon'),
  iconTool: className('icon', 'tool'),
  iconChevronRight: className('icon', 'chevron-right'),
  wobbleAnimation: bem('wobble')(),
};
