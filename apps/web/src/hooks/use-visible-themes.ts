'use client';

import * as React from 'react';

import type { Theme } from '@/types/theme';

export function useVisibleThemes<T extends Theme>(themes: T[]) {
  const [visibleThemes, setVisibleThemes] = React.useState<T[]>(themes);
  const [hiddenThemes, setHiddenThemes] = React.useState<T[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const fontSize = 16;
  const padding = 12;
  const gap = 8;

  const updateVisibleThemes = () => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const newVisibleThemes: T[] = [];
    const newHiddenThemes: T[] = [];

    const containerWidth = container.offsetWidth - 52 - gap - 36 - gap - 20;

    let totalWidth = 0;

    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'nowrap';
    document.body.appendChild(temp);

    themes.forEach((theme) => {
      const element = document.createElement('div');
      element.innerText = theme.title;
      element.style.fontSize = `${fontSize}px`;
      element.style.marginRight = `${gap}px`;
      element.style.paddingLeft = `${padding}px`;
      element.style.paddingRight = `${padding}px`;
      temp.appendChild(element);

      const width = element.offsetWidth;

      if (totalWidth + width <= containerWidth) {
        newVisibleThemes.push(theme);
        totalWidth += width;
      } else {
        newHiddenThemes.push(theme);
      }

      temp.removeChild(element);
    });

    document.body.removeChild(temp);

    setVisibleThemes(newVisibleThemes);
    setHiddenThemes(newHiddenThemes);
  };

  React.useEffect(() => {
    updateVisibleThemes();

    window.addEventListener('resize', updateVisibleThemes);

    return () => {
      window.removeEventListener('resize', updateVisibleThemes);
    };
  }, [themes, fontSize, padding, gap]);

  return { visibleThemes, hiddenThemes, containerRef };
}
