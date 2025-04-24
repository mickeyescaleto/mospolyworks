import { Brand } from '@/shared/ui/brand';

export function LoadingScreen() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <Brand className="size-24 animate-spin" />
    </main>
  );
}
