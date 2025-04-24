'use client';

import { useRouter } from 'next/navigation';

import { ChevronDownIcon } from '@repo/ui/core/icons';

import { ContributorButton } from '@/entities/project/ui/contributor-button';
import { type Contributor } from '@/entities/project/types/contributor';
import { ROUTES } from '@/shared/constants/routes';
import { AdaptiveInteraction } from '@/shared/ui/adaptive-interaction';

type ProjectCardContributorsProps = {
  contributors: Contributor[];
};

export function ProjectCardContributors({
  contributors,
}: ProjectCardContributorsProps) {
  const router = useRouter();

  const author = contributors?.[0];

  if (!author) {
    return null;
  }

  return (
    <div className="inline-block text-sm text-zinc-500 transition-colors">
      {contributors.length > 1 ? (
        <div
          onClick={(event) => event.preventDefault()}
          className="inline-block"
        >
          <AdaptiveInteraction
            trigger={
              <div className="group inline-flex items-center gap-1 hover:[&>*]:opacity-80 data-[state=open]:[&>*]:opacity-80">
                <span>Несколько авторов</span>

                <ChevronDownIcon className="size-3.5 transform transition-transform duration-200 group-hover:-rotate-180 group-data-[state=open]:-rotate-180" />
              </div>
            }
            content={
              <div className="flex max-h-32 flex-col overflow-hidden overflow-y-auto rounded-md">
                {contributors.map((contributor) => (
                  <ContributorButton
                    key={contributor.id}
                    contributor={contributor}
                  />
                ))}
              </div>
            }
            classNames={{ content: 'p-1 overflow-hidden' }}
          />
        </div>
      ) : (
        <span
          onClick={(event) => {
            event.preventDefault();
            router.push(`${ROUTES.USERS}/${author.id}`);
          }}
          className="hover:opacity-80"
        >{`${author.name} ${author.surname}`}</span>
      )}
    </div>
  );
}
