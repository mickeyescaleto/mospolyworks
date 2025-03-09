'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { AlertCircleIcon, HeartIcon } from '@repo/ui/core/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';

import type { ExhibitionProject } from '@/types/project';

type ProjectCardProps = {
  project: ExhibitionProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  function formatNumberWithK(number: number) {
    if (number >= 1000) {
      return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }

    return number.toString();
  }

  function getLikesWord(count: number) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${count} лайков`;
    }

    if (lastDigit === 1) {
      return `${count} лайк`;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} лайка`;
    }

    return `${count} лайков`;
  }

  return (
    <Link href={`/projects/${project.id}`} className="self-start">
      <div className="relative">
        <Image
          src={project.image}
          width={180}
          height={270}
          sizes="(max-width: 40rem) 50vw, (max-width: 48rem) 33.33vw, 25vw"
          alt="Image"
          className="aspect-[2/3] size-full rounded-lg bg-zinc-100 object-cover dark:bg-zinc-800"
        />

        {project.status !== 'VERIFIED' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-2 right-2 z-10 rounded-full bg-zinc-900/60 p-1">
                  <AlertCircleIcon className="size-4 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent align="center" side="bottom">
                <p>Проект не проверен</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute right-2 bottom-2 z-10 flex items-center gap-x-1 rounded-full bg-zinc-900/60 p-1 px-2">
                <HeartIcon className="size-3.5 text-white" />
                <p className="text-xs text-white">
                  {formatNumberWithK(project._count.likes)}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent align="center" side="top">
              <p>{getLikesWord(project._count.likes)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-2 space-y-1">
        <p className="text-base leading-5 font-semibold text-zinc-900 dark:text-white">
          {project.title}
        </p>

        <p
          onClick={(event) => {
            event.preventDefault();
            router.push(`/users/${project.author.id}`);
          }}
          tabIndex={0}
          className="text-sm text-zinc-500 hover:opacity-80 dark:text-zinc-500"
        >
          {[project.author.name, project.author.surname].join(' ')}
        </p>
      </div>
    </Link>
  );
}
