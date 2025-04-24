import Link from 'next/link';

import { Button } from '@repo/ui/core/button';

import { type Tag } from '@/entities/tag/types/tag';
import { ROUTES } from '@/shared/constants/routes';

type TagButtonProps = {
  tag: Omit<Tag, 'category'>;
};

export function TagButton({ tag }: TagButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="xs"
      className="bg-secondary/50 hover:bg-secondary text-secondary-foreground/80 hover:text-secondary-foreground rounded-sm"
      asChild
    >
      <Link href={`${ROUTES.TAGS}/${tag.id}`}>{tag.label}</Link>
    </Button>
  );
}
