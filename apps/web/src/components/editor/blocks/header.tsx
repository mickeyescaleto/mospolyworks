import { JSX } from 'react';
import HTMLReactParser from 'html-react-parser';
import { RenderFn } from '@/components/editor/editor-output';

export type HeaderBlockData = {
  text: string;
  level: number;
};

export const Header: RenderFn<HeaderBlockData> = ({ data, className = '' }) => {
  const props: {
    [s: string]: string;
  } = {};

  if (className) {
    props.className = className;
  }

  const Tag = `h${data?.level || 2}` as keyof JSX.IntrinsicElements;
  return <Tag {...props}>{data?.text && HTMLReactParser(data.text)}</Tag>;
};
