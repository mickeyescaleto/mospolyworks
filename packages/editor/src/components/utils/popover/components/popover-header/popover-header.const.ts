import { bem } from '@repo/editor/components/utils/bem';

const className = bem('ce-popover-header');

export const css = {
  root: className(),
  text: className('text'),
  backButton: className('back-button'),
};
