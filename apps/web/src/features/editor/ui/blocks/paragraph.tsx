import HTMLReactParser from 'html-react-parser';

import { cn } from '@repo/ui/utilities/cn';

import { type RenderFn } from '@/features/editor/ui/editor-output-block';
import { type AlignmentTune } from '@/features/editor/ui/tunes/alignment';

type ParagraphBlockData = {
  text: string;
};

type ParagraphBlockTunes = {
  tunes: AlignmentTune;
};

const ParagraphBlock: RenderFn<ParagraphBlockData, ParagraphBlockTunes> = ({
  data,
  tunes,
  className = 'o-paragraph',
}) => {
  const props: {
    [s: string]: string;
  } = {};

  if (tunes.alignmentTune.alignment) {
    className = cn(className, `o-align-${tunes.alignmentTune.alignment}`);
  }

  if (className) {
    props.className = className;
  }

  return <p {...props}>{data?.text && HTMLReactParser(data.text)}</p>;
};

export { ParagraphBlock };
