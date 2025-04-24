import { getWordWithPlural } from '@/shared/utilities/get-word-with-plural';

export function getPartnersWord(count: number) {
  return getWordWithPlural(count, 'партнёр', 'партнёра', 'партнёров');
}
