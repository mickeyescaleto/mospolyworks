import { ReactNode } from 'react';
import Link from 'next/link';

import { ProjectCardCover } from '@/entities/project/ui/project-card-cover';
import { ProjectCardTitle } from '@/entities/project/ui/project-card-title';
import { ProjectCardContributors } from '@/entities/project/ui/project-card-contributors';
import { type Contributor } from '@/entities/project/types/contributor';

type ProjectCardProps = {
  href: string;
  cover?: string | null;
  title?: string | null;
  author: Contributor;
  partners: Contributor[];
  overlay?: ReactNode;
};

export function ProjectCard({
  href,
  cover,
  title,
  author,
  partners,
  overlay,
}: ProjectCardProps) {
  const contributors = [author, ...partners];

  return (
    <Link href={href}>
      <ProjectCardCover
        cover={cover || undefined}
        alt={title || undefined}
        overlay={overlay}
      />

      {(title || contributors) && (
        <div className="mt-2 flex flex-col gap-1">
          {title && <ProjectCardTitle title={title} />}

          {contributors && (
            <ProjectCardContributors contributors={contributors} />
          )}
        </div>
      )}
    </Link>
  );
}
