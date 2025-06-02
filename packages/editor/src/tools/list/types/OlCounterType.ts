import {
  IconNumber,
  IconLowerRoman,
  IconUpperRoman,
  IconLowerAlpha,
  IconUpperAlpha,
} from '../styles/icons/index.js';

export type OlCounterType =
  | 'numeric'
  | 'upper-roman'
  | 'lower-roman'
  | 'upper-alpha'
  | 'lower-alpha';

export const OlCounterTypesMap = new Map<string, string>([
  ['Numeric', 'numeric'],
  ['Lower Roman', 'lower-roman'],
  ['Upper Roman', 'upper-roman'],
  ['Lower Alpha', 'lower-alpha'],
  ['Upper Alpha', 'upper-alpha'],
]);

export const OlCounterIconsMap = new Map<string, string>([
  ['numeric', IconNumber],
  ['lower-roman', IconLowerRoman],
  ['upper-roman', IconUpperRoman],
  ['lower-alpha', IconLowerAlpha],
  ['upper-alpha', IconUpperAlpha],
]);
