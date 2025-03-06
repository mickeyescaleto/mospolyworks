'use client';

import * as React from 'react';

export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    setIsTouchDevice(isTouch);
  }, [navigator.maxTouchPoints]);

  return isTouchDevice;
}
