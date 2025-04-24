import Image from 'next/image';

type ProjectCoverProps = {
  cover?: string | null;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

export function ProjectCover({
  cover,
  alt = 'Project cover',
  sizes = '100vw',
  priority = true,
  quality = 100,
}: ProjectCoverProps) {
  return (
    <div className="relative aspect-video select-none md:aspect-[16/7]">
      {cover ? (
        <Image
          src={cover}
          alt={alt}
          sizes={sizes}
          priority={priority}
          quality={quality}
          fill
          className="rounded-lg object-cover"
        />
      ) : (
        <div className="bg-secondary/30 border-secondary-50 flex size-full items-center justify-center rounded-lg border border-dashed">
          <p className="text-secondary-foreground/50 text-sm">
            Изображение отсутствует
          </p>
        </div>
      )}
    </div>
  );
}
