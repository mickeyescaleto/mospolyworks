'use client';

import { useEffect, useState } from 'react';

export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    function onResize() {
      setIsTouchDevice(
        'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.maxTouchPoints > 0,
      );
    }

    window.addEventListener('resize', onResize);

    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return isTouchDevice;
}
