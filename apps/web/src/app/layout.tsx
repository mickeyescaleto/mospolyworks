import type { Metadata } from 'next';
import '@repo/ui/styles/main';

export const metadata: Metadata = {
  title: 'mospolyworks',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
