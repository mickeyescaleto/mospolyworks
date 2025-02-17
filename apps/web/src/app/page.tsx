'use client';

import { useEffect, useState } from 'react';
import { Editor, EditorOutput } from '@/components/editor';
import { DataProp } from '@/components/editor/editor-output';

const RootPage = () => {
  const [data, setData] = useState<DataProp>({ blocks: [] });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="px-4">
      <section className="mx-auto max-w-2xl py-8">
        <Editor data={data} onChange={setData} />
      </section>
      <section className="mx-auto max-w-2xl py-8">
        <EditorOutput data={data} />
      </section>
    </div>
  );
};

export default RootPage;
