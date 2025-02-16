import type { Metadata } from 'next';
import { gilroy } from '@/styles/fonts';
import '@/styles/main.css';

export const metadata: Metadata = {
  title: 'mospolyworks',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ru">
      <body className={`${gilroy.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
