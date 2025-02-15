'use client';

import dynamic from 'next/dynamic';

const CustomEditor = dynamic(() => import('./cutsom-editor'), {
  ssr: false,
});

export const Editor = () => {
  return <CustomEditor />;
};
