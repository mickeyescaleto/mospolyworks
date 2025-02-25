'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-zinc-100! font-sans! dark:group-[.toaster]:bg-zinc-900! group-[.toaster]:text-zinc-900! dark:group-[.toaster]:text-white! group-[.toaster]:border! group-[.toaster]:border-zinc-200! dark:group-[.toaster]:border-zinc-700! group-[.toaster]:shadow-lg!',
          content:
            'data-[content]:font-medium! data-[content]:text-sm! group-[.toaster]:text-zinc-900! dark:group-[.toaster]:text-white!',
          title:
            'data-[title]:font-medium! data-[title]:text-sm! group-[.toaster]:text-zinc-900! dark:group-[.toaster]:text-white!',
          description:
            'group-[.toast]:text-zinc-700! data-[description]:font-medium! data-[description]:text-sm! dark:group-[.toast]:text-zinc-300!',
        },
      }}
      {...props}
    />
  );
};
