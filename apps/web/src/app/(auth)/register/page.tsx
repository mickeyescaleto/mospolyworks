import { type Metadata } from 'next';
import Link from 'next/link';

import { RegisterForm } from '@/widgets/auth-form';
import { ROUTES } from '@/shared/constants/routes';
import { Brand } from '@/shared/ui/brand';

export const metadata: Metadata = {
  title: 'регистрация',
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
          Для регистрации необходимо заполнить все поля формы
        </p>

        <RegisterForm />

        <p className="text-muted-foreground -mt-2 text-center text-sm">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-foreground hover:underline">
            Авторизуйтесь
          </Link>
        </p>
      </div>
    </div>
  );
}
