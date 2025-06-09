import { ReactNode } from 'react';
import Image from 'next/image';

type ProjectCardCoverProps = {
  cover?: string | null;
  overlay?: ReactNode;
  alt?: string | null;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

export function ProjectCardCover({
  cover,
  overlay,
  alt = 'Project cover',
  sizes = '(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw',
  priority = false,
  quality = 100,
}: ProjectCardCoverProps) {
  return (
    <div className="border-border relative aspect-video rounded-md border select-none">
      {cover ? (
        <Image
          src={cover}
          alt={alt}
          sizes={sizes}
          priority={priority}
          quality={quality}
          fill
          className="rounded-md object-cover"
        />
      ) : (
        <div className="bg-secondary/30 border-secondary-50 flex size-full items-center justify-center rounded-md border border-dashed">
          <p className="text-secondary-foreground/50 text-sm">
            Изображение отсутствует
          </p>
        </div>
      )}

      {overlay && <div className="absolute inset-0 z-1">{overlay}</div>}
    </div>
  );
}
