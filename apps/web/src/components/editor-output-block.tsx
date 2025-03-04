import { JSX } from 'react';
import { OutputData } from '@repo/editor';

import { ParagraphBlock } from '@/components/editor-output-blocks/paragraph';
import { HeaderBlock } from '@/components/editor-output-blocks/header';
import { ImageBlock } from '@/components/editor-output-blocks/image';

export type ConfigProp = Record<string, RenderConfig>;

export type RenderConfig = Record<string, any>;

export type RenderFn<T = undefined, K = Record<string, any> | undefined> = (
  _: {
    data: T;
    className?: string;
  } & K,
) => JSX.Element;

export type RenderFnWithoutData<K = Record<string, any> | undefined> = (
  _: {
    className?: string;
  } & K,
) => JSX.Element;

export type RenderersProp = Record<string, RenderFn<any>>;

export type { OutputData };

export const EditorOutputBlock = ({
  data,
  config = {},
  renderers = {},
}: {
  data: OutputData;
  config?: ConfigProp;
  renderers?: RenderersProp;
}) => {
  const defaultRenderers = {
    paragraph: ParagraphBlock,
    header: HeaderBlock,
    image: ImageBlock,
  };

  const availableRenderers = {
    ...defaultRenderers,
    ...renderers,
  };

  return (
    <>
      {data.blocks.map((block, i) => {
        if (block.type.toString() in availableRenderers) {
          // @ts-ignore
          const Tag = availableRenderers[block.type];
          return (
            <Tag
              key={block.id ? block.id : i}
              data={block.data}
              {...config[block.type]}
            />
          );
        }
      })}
    </>
  );
};
