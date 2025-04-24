import { getWordWithPlural } from '@/shared/utilities/get-word-with-plural';

export function getTagsWord(count: number) {
  return getWordWithPlural(count, 'тег', 'тега', 'тегов');
}
