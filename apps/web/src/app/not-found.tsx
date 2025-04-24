import Link from 'next/link';
import { type Metadata } from 'next';

import { Button } from '@repo/ui/core/button';

import { ROUTES } from '@/shared/constants/routes';
import { Wrapper } from '@/shared/ui/wrapper';
import { Heading } from '@/shared/ui/heading';

export const metadata: Metadata = {
  title: 'страница не найдена',
};

export default function NotFound() {
  return (
    <main className="flex flex-1">
      <Wrapper className="flex flex-1 flex-col items-center justify-center gap-4">
        <span className="text-5xl">😓</span>

        <Heading className="text-center">Упс, страница не найдена :(</Heading>

        <Button variant="secondary" asChild>
          <Link href={ROUTES.MAIN}>Перейти на главную страницу</Link>
        </Button>
      </Wrapper>
    </main>
  );
}
