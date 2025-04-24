'use client';

import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { type Category } from '@/entities/category/types/category';

export function useVisibleCategories<T extends Category>(categories: T[]) {
  const [visibleCategories, setVisibleCategories] = useState<T[]>(categories);
  const [hiddenCategories, setHiddenCategories] = useState<T[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const fontSize = 14;
  const padding = 12;
  const gap = 4;

  const updateVisibleCategories = () => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const newVisibleCategories: T[] = [];
    const newHiddenCategories: T[] = [];

    const containerWidth = container.offsetWidth - 50 - gap - 36 - 24;

    let totalWidth = 0;

    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'nowrap';
    document.body.appendChild(temp);

    categories.forEach((category) => {
      const element = document.createElement('div');
      element.innerText = category.label;
      element.style.fontSize = `${fontSize}px`;
      element.style.marginRight = `${gap}px`;
      element.style.paddingLeft = `${padding}px`;
      element.style.paddingRight = `${padding}px`;
      temp.appendChild(element);

      const width = element.offsetWidth;

      if (totalWidth + width <= containerWidth) {
        newVisibleCategories.push(category);
        totalWidth += width;
      } else {
        newHiddenCategories.push(category);
      }

      temp.removeChild(element);
    });

    document.body.removeChild(temp);

    setVisibleCategories(newVisibleCategories);
    setHiddenCategories(newHiddenCategories);
  };

  const debouncedUpdateVisibleCategories = useDebouncedCallback(() => {
    updateVisibleCategories();
  }, 100);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new ResizeObserver(debouncedUpdateVisibleCategories);

    observer.observe(container);

    return () => {
      observer.unobserve(container);
      debouncedUpdateVisibleCategories.cancel();
    };
  }, [categories, fontSize, padding, gap, debouncedUpdateVisibleCategories]);

  return { visibleCategories, hiddenCategories, containerRef };
}
