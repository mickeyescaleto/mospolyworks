import { getWordWithPlural } from '@/shared/utilities/get-word-with-plural';

export function getLikesWord(count: number) {
  return getWordWithPlural(count, 'лайк', 'лайка', 'лайков');
}
