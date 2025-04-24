export function formatNumberWithK(number: number) {
  if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  return number.toString();
}
