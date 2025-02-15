import { JSX } from 'react';
import { Paragraph } from '@/components/editor/blocks/paragraph';
import { Header } from '@/components/editor/blocks/header';

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

export type Block = {
  id?: string;
  type: string;
  data: Record<string, any>;
};

export type DataProp = {
  blocks: Block[];
};

export const EditorOutput = ({
  data,
  config = {},
  renderers = {},
}: {
  data: DataProp;
  config?: ConfigProp;
  renderers?: RenderersProp;
}) => {
  const defaultRenderers = {
    paragraph: Paragraph,
    header: Header,
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
