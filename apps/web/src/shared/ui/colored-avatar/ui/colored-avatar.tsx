import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/core/avatar';

import { getColorFromText } from '@/shared/utilities/get-color-from-text';

type ColoredAvatarProps = {
  src: string;
  alt: string;
  fallback: string;
  classNames?: {
    avatar?: string;
    fallback?: string;
  };
};

export function ColoredAvatar({
  src,
  alt,
  fallback,
  classNames,
}: ColoredAvatarProps) {
  const { color, darkenedColor } = getColorFromText(fallback);

  return (
    <Avatar className={classNames?.avatar}>
      <AvatarImage src={src} alt={alt} />

      <AvatarFallback
        style={{
          background: `linear-gradient(180deg, ${darkenedColor} 0%, ${color} 100%)`,
          color: 'white',
        }}
        className={classNames?.fallback}
      >
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
