import { type RenderFnWithoutData } from '@/features/editor/ui/editor-output-block';

const DelimiterBlock: RenderFnWithoutData = ({ className = 'delimiter' }) => {
  const props: {
    [s: string]: string;
  } = {};

  if (className) {
    props.className = className;
  }

  return <div {...props} />;
};

export { DelimiterBlock };
