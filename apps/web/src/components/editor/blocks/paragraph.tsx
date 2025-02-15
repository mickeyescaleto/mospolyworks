import HTMLReactParser from 'html-react-parser';
import { RenderFn } from '@/components/editor/editor-output';

export type ParagraphBlockData = {
  text: string;
};

export const Paragraph: RenderFn<ParagraphBlockData> = ({
  data,
  className = '',
}) => {
  const props: {
    [s: string]: string;
  } = {};

  if (className) {
    props.className = className;
  }

  return <p {...props}>{data?.text && HTMLReactParser(data.text)}</p>;
};
