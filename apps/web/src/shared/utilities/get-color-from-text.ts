const COLORS = [
  '#3B82F6',
  '#10B981',
  '#EF4444',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#84CC16',
  '#0EA5E9',
  '#D946EF',
] as const;

export function getColorFromText(text: string) {
  const hash = Array.from(text).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );

  const color = COLORS[hash % COLORS.length]!;

  const percent = 15;

  const p = Math.min(100, Math.max(0, percent)) / 100;

  const formattedHex = color.replace(/^#/, '');

  const r = parseInt(formattedHex.substring(0, 2), 16);
  const g = parseInt(formattedHex.substring(2, 4), 16);
  const b = parseInt(formattedHex.substring(4, 6), 16);

  const darkenedR = Math.floor(r * (1 - p));
  const darkenedG = Math.floor(g * (1 - p));
  const darkenedB = Math.floor(b * (1 - p));

  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const darkenedColor = `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`;

  return { color, darkenedColor };
}
