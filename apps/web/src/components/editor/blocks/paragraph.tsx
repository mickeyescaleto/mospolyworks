import HTMLReactParser from 'html-react-parser';
import { RenderFn } from '@/components/editor/editor-output';

export type ParagraphBlockData = {
  text: string;
};

export const ParagraphBlock: RenderFn<ParagraphBlockData> = ({
  data,
  className = 'o-paragraph',
}) => {
  const props: {
    [s: string]: string;
  } = {};

  if (className) {
    props.className = className;
  }

  return <p {...props}>{data?.text && HTMLReactParser(data.text)}</p>;
};
