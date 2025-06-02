import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Badge } from '@repo/ui/core/badge';

import { UserDetails } from '@/widgets/user-details';
import { UserService } from '@/entities/user';
import { ColoredAvatar } from '@/shared/ui/colored-avatar';
import { getInitials } from '@/shared/utilities/get-initials';
import { Wrapper } from '@/shared/ui/wrapper';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const user = await UserService.getUserById(id).catch(() => null);

  if (!user) {
    return {
      title: 'пользователь не найден',
    };
  }

  return {
    title: `${user.surname} ${user.name} ${user.patronymic}`,
  };
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await UserService.getUserById(id).catch(() => notFound());

  return (
    <section>
      <Wrapper className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <ColoredAvatar
            src={user.avatar}
            alt="User avatar"
            fallback={getInitials([user.name, user.surname])}
            classNames={{
              avatar: 'size-48 rounded-xl md:size-64',
              fallback: 'text-5xl rounded-xl',
            }}
          />

          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p className="text-xl font-medium md:text-3xl">{`${user.surname} ${user.name} ${user.patronymic}`}</p>

            <div className="flex flex-wrap justify-center gap-1 sm:justify-start">
              <Badge variant="secondary">
                {user.roles.includes('student') ? 'Студент' : 'Сотрудник'}
              </Badge>

              {user.faculty && (
                <Badge variant="secondary">{user.faculty}</Badge>
              )}

              {user.specialization && (
                <Badge variant="secondary">{user.specialization}</Badge>
              )}

              {user.group && <Badge variant="secondary">{user.group}</Badge>}
            </div>
          </div>
        </div>

        <UserDetails user={user} />
      </Wrapper>
    </section>
  );
}
