'use client';

import dynamic from 'next/dynamic';

import { Loader2Icon } from '@repo/ui/core/icons';

const LazyEditorBlock = dynamic(
  () => import('@/features/editor/ui/editor-block'),
  {
    loading: () => (
      <div className="flex justify-center py-4">
        <Loader2Icon className="text-foreground size-6 animate-spin" />
      </div>
    ),
    ssr: false,
  },
);

export { LazyEditorBlock };
