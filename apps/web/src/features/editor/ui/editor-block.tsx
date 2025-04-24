'use client';

import { memo, useEffect, useRef } from 'react';

import Editor, { type OutputData } from '@repo/editor';

type EditorBlockProps = {
  data?: OutputData;
  onChange?(data: OutputData): void;
  holder?: string;
};

function EditorBlock({ data, onChange, holder = 'editor' }: EditorBlockProps) {
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    function initEditor() {
      const editor = new Editor({
        holder,
        data,
        onReady: () => {
          editorRef.current = editor;
        },
        onChange: async (api) => {
          const data = await api.saver.save();
          onChange?.(data);
        },
      });
    }

    if (!editorRef.current) {
      initEditor();
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, [editorRef]);

  return <div id={holder} className="max-w-full" />;
}

export default memo(EditorBlock);
