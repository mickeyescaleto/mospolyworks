export const OPTIONS: Array<{
  value: string;
  label: string;
}> = [
  { value: 'date', label: 'Самые недавние' },
  { value: 'rating', label: 'С высшими оценками' },
  { value: 'verified', label: 'Проверенные' },
] as const;
