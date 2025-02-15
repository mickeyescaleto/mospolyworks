'use client';

import { useEffect, useRef } from 'react';
import Editor, { API } from '@repo/editor';

const CustomEditor = () => {
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    if (!editorRef.current) {
      initEditor();
    }
  }, [editorRef]);

  const initEditor = () => {
    const editor = new Editor({
      holder: 'editor',
      onReady: () => {
        editorRef.current = editor;
      },
      onChange: async (api: API) => {
        console.log(await api.saver.save());
      },
    });
  };

  return (
    <section>
      <div id="editor" />
    </section>
  );
};

export default CustomEditor;
