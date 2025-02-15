import { bem } from '@/components/utils/bem';

const className = bem('ce-hint');

export const css = {
  root: className(),
  alignedStart: className(null, 'align-left'),
  alignedCenter: className(null, 'align-center'),
  title: className('title'),
  description: className('description'),
};
