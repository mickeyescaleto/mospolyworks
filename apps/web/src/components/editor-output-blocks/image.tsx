import Image from 'next/image';

import { RenderFn } from '@/components/editor-output-block';

export type ImageBlockData = {
  file: {
    url: string;
    ratio: number;
  };
  withBorder: boolean;
  withBackground: boolean;
  roundedCorners: boolean;
  [s: string]: any;
};

export type ImageBlockConfig = {
  actionsClassNames?: {
    [s: string]: string;
  };
};

export const ImageBlock: RenderFn<ImageBlockData, ImageBlockConfig> = ({
  data,
  className = 'o-image',
  actionsClassNames = {
    withBorder: 'with-border',
    withBackground: 'with-background',
    roundedCorners: 'rounded-corners',
  },
}) => {
  const classNames: string[] = [];
  if (className) classNames.push(className);

  Object.keys(actionsClassNames).forEach((actionName) => {
    if (data && data[actionName] === true && actionName in actionsClassNames) {
      // @ts-ignore
      classNames.push(actionsClassNames[actionName]);
    }
  });

  const props: {
    [s: string]: string;
  } = {};

  if (classNames.length > 0) {
    props.className = classNames.join(' ');
  }

  return (
    <Image
      src={data.file.url}
      width="0"
      height="0"
      sizes="100vw"
      alt="Image"
      placeholder="blur"
      {...props}
    />
  );
};
