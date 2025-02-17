'use client';

import { useEffect, useRef } from 'react';
import Editor, { API, OutputData } from '@repo/editor';

export type CustomEditorProps = {
  data?: OutputData;
  onChange(data: OutputData): void;
};

const CustomEditor = ({ data, onChange }: CustomEditorProps) => {
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    if (!editorRef.current) {
      initEditor();
    }
  }, [editorRef]);

  const initEditor = () => {
    const editor = new Editor({
      holder: 'editor',
      data,
      onReady: () => {
        editorRef.current = editor;
      },
      onChange: async (api: API) => {
        const data = await api.saver.save();
        onChange(data);
      },
    });
  };

  return <div id="editor" />;
};

export default CustomEditor;
