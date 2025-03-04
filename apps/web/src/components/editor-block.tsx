'use client';

import { useEffect, useRef, memo } from 'react';
import Editor, { OutputData } from '@repo/editor';

export type EditorBlockProps = {
  data?: OutputData;
  onChange(data: OutputData): void;
  holder: string;
};

function EditorBlock({ data, onChange, holder }: EditorBlockProps) {
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    if (!editorRef.current) {
      initEditor();
    }
  }, [editorRef]);

  const initEditor = () => {
    const editor = new Editor({
      holder,
      data,
      onReady: () => {
        editorRef.current = editor;
      },
      onChange: async (api) => {
        const data = await api.saver.save();
        onChange(data);
      },
    });
  };

  return <div id={holder} className="max-w-full" />;
}

export default memo(EditorBlock);
