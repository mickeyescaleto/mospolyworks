import { ComponentProps } from 'react';
import Image from 'next/image';

import { cn } from '@repo/ui/utilities/cn';

type BrandProps = ComponentProps<'div'>;

export function Brand({ className, ...props }: BrandProps) {
  return (
    <div className={cn('relative size-10', className)} {...props}>
      <Image
        src="/icons/brand.svg"
        loading="eager"
        quality={100}
        priority
        fill
        alt="Brand"
        className="select-none dark:invert"
      />
    </div>
  );
}
