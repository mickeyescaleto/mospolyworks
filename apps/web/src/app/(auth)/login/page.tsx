import { type Metadata } from 'next';
import Link from 'next/link';

import { AuthForm } from '@/widgets/auth-form';
import { ROUTES } from '@/shared/constants/routes';
import { Brand } from '@/shared/ui/brand';

export const metadata: Metadata = {
  title: 'вход',
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="w-full max-w-xs space-y-5 px-4 py-8">
        <div className="my-3 flex w-full flex-col items-center">
          <Link href={ROUTES.MAIN} className="rounded-full">
            <Brand className="size-24" />
          </Link>
        </div>

        <p className="text-muted-foreground text-center">
          Для авторизации используйте логин&nbsp;и&nbsp;пароль
        </p>

        <AuthForm />

        <p className="text-muted-foreground -mt-2 text-center text-sm">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-foreground hover:underline">
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
}
