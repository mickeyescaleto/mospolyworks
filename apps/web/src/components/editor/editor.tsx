'use client';

import dynamic from 'next/dynamic';
import { CustomEditorProps } from '@/components/editor/cutsom-editor';

const CustomEditor = dynamic(() => import('./cutsom-editor'), {
  ssr: false,
});

export const Editor = ({ data, onChange }: CustomEditorProps) => {
  return <CustomEditor data={data} onChange={onChange} />;
};
