import Image from 'next/image';

import { type RenderFn } from '@/features/editor/ui/editor-output-block';

type ImageBlockData = {
  file: {
    url: string;
  };
  withBorder: boolean;
  withBackground: boolean;
  roundedCorners: boolean;
  [s: string]: any;
};

type ImageBlockConfig = {
  actionsClassNames?: {
    [s: string]: string;
  };
};

const ImageBlock: RenderFn<ImageBlockData, ImageBlockConfig> = ({
  data,
  className = 'o-image',
  actionsClassNames = {
    withBorder: 'with-border',
    withBackground: 'with-background',
    roundedCorners: 'rounded-corners',
  },
}) => {
  const props: {
    [s: string]: string;
  } = {};

  const classNames: string[] = [];

  if (className) {
    classNames.push(className);
  }

  Object.keys(actionsClassNames).forEach((actionName) => {
    if (data && data[actionName] === true && actionName in actionsClassNames) {
      classNames.push(actionsClassNames[actionName] as string);
    }
  });

  if (classNames.length > 0) {
    props.className = classNames.join(' ');
  }

  return (
    <Image
      src={data.file.url}
      quality={100}
      width="1024"
      height="768"
      alt="Image"
      {...props}
    />
  );
};

export { ImageBlock };
