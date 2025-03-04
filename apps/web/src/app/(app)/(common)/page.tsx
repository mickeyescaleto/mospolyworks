'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import {
  EditorOutputBlock,
  OutputData,
} from '@/components/editor-output-block';

const EditorBlock = dynamic(() => import('@/components/editor-block'), {
  ssr: false,
});

export default function RootPage() {
  const [data, setData] = useState<OutputData>();

  return (
    <div className="px-4">
      <section className="mx-auto max-w-2xl space-y-4 py-8">
        <h1>Редактор:</h1>
        <EditorBlock data={data} onChange={setData} holder="editor" />
      </section>
      {data && (
        <section className="mx-auto max-w-2xl space-y-4 py-8">
          <h1>Выходные данные:</h1>
          <div>
            <EditorOutputBlock data={data} />
          </div>
        </section>
      )}
    </div>
  );
}
