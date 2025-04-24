import { JSX } from 'react';
import HTMLReactParser from 'html-react-parser';

import { cn } from '@repo/ui/utilities/cn';

import { type RenderFn } from '@/features/editor/ui/editor-output-block';
import { type AlignmentTune } from '@/features/editor/ui/tunes/alignment';

type HeaderBlockData = {
  text: string;
  level: number;
};

type HeaderBlockTunes = {
  tunes: AlignmentTune;
};

const HeaderBlock: RenderFn<HeaderBlockData, HeaderBlockTunes> = ({
  data,
  tunes,
  className = 'o-header',
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

  const Tag = `h${data?.level || 2}` as keyof JSX.IntrinsicElements;

  return <Tag {...props}>{data?.text && HTMLReactParser(data.text)}</Tag>;
};

export { HeaderBlock };
