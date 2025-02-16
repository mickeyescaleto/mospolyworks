import { bem } from '@repo/editor/components/utils/bem';

const className = bem('cdx-search-field');

export const css = {
  wrapper: className(),
  icon: className('icon'),
  input: className('input'),
};
