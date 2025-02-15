import { bem } from '@/components/utils/bem';

const className = bem('ce-popover');

export const css = {
  popover: className(),
  popoverContainer: className('container'),
  popoverOpenTop: className(null, 'open-top'),
  popoverOpenLeft: className(null, 'open-left'),
  popoverOpened: className(null, 'opened'),
  search: className('search'),
  nothingFoundMessage: className('nothing-found-message'),
  nothingFoundMessageDisplayed: className('nothing-found-message', 'displayed'),
  items: className('items'),
  overlay: className('overlay'),
  overlayHidden: className('overlay', 'hidden'),
  popoverNested: className(null, 'nested'),
  getPopoverNestedClass: (level: number) =>
    className(null, `nested-level-${level.toString()}`),
  popoverInline: className(null, 'inline'),
  popoverHeader: className('header'),
};

export enum CSSVariables {
  NestingLevel = '--nesting-level',
  PopoverHeight = '--popover-height',
  InlinePopoverWidth = '--inline-popover-width',
  TriggerItemLeft = '--trigger-item-left',
  TriggerItemTop = '--trigger-item-top',
}
