import { getWordWithPlural } from '@/shared/utilities/get-word-with-plural';

export function getProjectsWord(count: number) {
  return getWordWithPlural(count, 'проект', 'проекта', 'проектов');
}
