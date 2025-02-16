import type { Metadata } from 'next';
import { gilroy } from '@/styles/fonts';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/main.css';

export const metadata: Metadata = {
  title: 'mospolyworks',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${gilroy.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
