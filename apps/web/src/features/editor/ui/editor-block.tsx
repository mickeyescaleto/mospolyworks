'use client';

import { memo, useEffect, useRef } from 'react';

import Editor, { type OutputData } from '@repo/editor';
import { cn } from '@repo/ui/utilities/cn';

type EditorBlockProps = {
  data?: OutputData;
  onChange?(data: OutputData): void;
  holder?: string;
  readOnly?: boolean;
};

function EditorBlock({
  data,
  onChange,
  holder = 'editor',
  readOnly = false,
}: EditorBlockProps) {
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
        readOnly,
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

  return (
    <div
      id={holder}
      className={cn('max-w-full', { 'editor-readonly': readOnly })}
    />
  );
}

export default memo(EditorBlock);
