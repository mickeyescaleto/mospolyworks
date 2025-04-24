'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';
import {
  AlertCircleIcon,
  BanIcon,
  CheckCircle2Icon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from 'lucide-react';

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      icons={{
        success: <CheckCircle2Icon className="size-4" />,
        info: <AlertCircleIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <BanIcon className="size-4" />,
        loading: <LoaderCircleIcon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: 'font-sans! rounded-md! shadow-md!',
        },
      }}
      style={
        {
          '--toast-icon-margin-start': 0,
          '--toast-icon-margin-end': 0,
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};
