'use client';

import Link from 'next/link';

import { cn } from '@repo/ui/utilities/cn';
import { Button } from '@repo/ui/core/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@repo/ui/core/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/core/tooltip';

import { type ExhibitionProject, ContributorButton } from '@/entities/project';
import { ColoredAvatar } from '@/shared/ui/colored-avatar';
import { getInitials } from '@/shared/utilities/get-initials';

type ProjectContributorsProps = {
  project: ExhibitionProject;
};

export function ProjectContributors({
  project: { author, partners },
}: ProjectContributorsProps) {
  const contributors = [author, ...partners];
  const visibleContributors = contributors.slice(0, 3);
  const number = contributors.length;

  if (number === 1) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="gap-1.5 px-1 text-sm sm:pr-3"
            asChild
          >
            <Link href={`/users/${author.id}`}>
              <ColoredAvatar
                src={author.avatar}
                alt="Author avatar"
                fallback={getInitials([author.name, author.surname])}
              />

              <span className="text-muted-foreground hidden truncate sm:inline">
                {`${author.name} ${author.surname}`}
              </span>
            </Link>
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom">
          <p>Открыть профиль</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn('group px-1 text-sm', { 'pr-3': number > 3 })}
            >
              <div className="flex items-center gap-0.5">
                <div className="flex -space-x-3">
                  {visibleContributors.map((contributor) => (
                    <ColoredAvatar
                      key={`visible-${contributor.id}`}
                      src={contributor.avatar}
                      alt="Contributor avatar"
                      fallback={getInitials([
                        contributor.name,
                        contributor.surname,
                      ])}
                      classNames={{
                        avatar:
                          'border-background group-hover:border-accent size-8 border-2 transition-colors',
                      }}
                    />
                  ))}
                </div>

                {number > 3 && (
                  <span className="text-muted-foreground text-sm">
                    +{number - 3}
                  </span>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>

        <DropdownMenuContent
          align="start"
          className="w-64 cursor-default overflow-hidden p-1"
        >
          <div className="flex max-h-32 flex-col overflow-hidden overflow-y-auto rounded-md">
            {contributors.map((contributor) => (
              <ContributorButton
                key={contributor.id}
                contributor={contributor}
              />
            ))}
          </div>
        </DropdownMenuContent>

        <TooltipContent side="bottom">
          <p>Посмотреть авторов</p>
        </TooltipContent>
      </DropdownMenu>
    </Tooltip>
  );
}
