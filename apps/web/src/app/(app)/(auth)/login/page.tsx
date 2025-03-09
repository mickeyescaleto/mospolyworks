import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { UserAuthForm } from '@/components/forms/user-auth';

export const metadata: Metadata = {
  title: 'авторизация',
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <div className="w-full max-w-xs space-y-5 px-4 py-8">
        <div className="flex w-full flex-col items-center">
          <Link href="/" className="relative block size-24 rounded-full">
            <Image
              src="/brand.svg"
              alt="Brand"
              fill
              priority
              draggable={false}
              className="select-none dark:invert"
            />
          </Link>
        </div>
        <p className="text-center font-medium text-zinc-700 dark:text-zinc-300">
          Для авторизации используйте логин и пароль от 
          <Link href="https://e.mospolytech.ru/" target="_blank" className="a">
            личного кабинета
          </Link>
        </p>
        <UserAuthForm />
      </div>
    </main>
  );
}
