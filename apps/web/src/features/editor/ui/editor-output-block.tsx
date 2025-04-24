import { ComponentProps, JSX } from 'react';

import { cn } from '@repo/ui/utilities/cn';
import { type OutputData } from '@repo/editor';

import { ParagraphBlock } from '@/features/editor/ui/blocks/paragraph';
import { HeaderBlock } from '@/features/editor/ui/blocks/header';
import { ImageBlock } from '@/features/editor/ui/blocks/image';

type RenderFn<T = undefined, K = Record<string, any> | undefined> = (
  _: {
    data: T;
    className?: string;
  } & K,
) => JSX.Element;

type RenderFnWithoutData<K = Record<string, any> | undefined> = (
  _: {
    className?: string;
  } & K,
) => JSX.Element;

type Block = RenderFn<any, any>;

type EditorOutputBlockProps = {
  data: OutputData;
} & ComponentProps<'div'>;

function EditorOutputBlock({
  data,
  className,
  ...props
}: EditorOutputBlockProps) {
  const blocks: Record<string, Block> = {
    paragraph: ParagraphBlock,
    header: HeaderBlock,
    image: ImageBlock,
  };

  return (
    <div className={cn('mb-32', className)} {...props}>
      {data.blocks.map((block, i) => {
        if (block.type.toString() in blocks) {
          const Tag = blocks[block.type] as Block;

          return (
            <Tag
              key={block.id ? block.id : i}
              data={block.data}
              tunes={block.tunes}
            />
          );
        }
      })}
    </div>
  );
}

export {
  type OutputData,
  type RenderFn,
  type RenderFnWithoutData,
  EditorOutputBlock,
};
