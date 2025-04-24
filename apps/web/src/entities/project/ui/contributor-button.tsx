'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@repo/ui/core/button';

import { type Contributor } from '@/entities/project/types/contributor';
import { ROUTES } from '@/shared/constants/routes';
import { ColoredAvatar } from '@/shared/ui/colored-avatar';
import { getInitials } from '@/shared/utilities/get-initials';

type ContributorButtonProps = {
  contributor: Contributor;
};

export function ContributorButton({ contributor }: ContributorButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={() => {
        router.push(`${ROUTES.USERS}/${contributor.id}`);
      }}
      className="justify-start rounded-none font-normal"
    >
      <ColoredAvatar
        src={contributor.avatar}
        alt="Contributor avatar"
        fallback={getInitials([contributor.name, contributor.surname])}
        classNames={{ avatar: 'size-6' }}
      />

      <span className="truncate text-sm">{`${contributor.name} ${contributor.surname}`}</span>
    </Button>
  );
}
