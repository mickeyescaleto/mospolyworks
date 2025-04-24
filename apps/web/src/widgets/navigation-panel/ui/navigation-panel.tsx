import Link from 'next/link';

import { NavigationPanelActions } from '@/widgets/navigation-panel/ui/navigation-panel-actions';
import { ThemeSwitch } from '@/features/theme-switch';
import { ROUTES } from '@/shared/constants/routes';
import { Wrapper } from '@/shared/ui/wrapper';
import { Brand } from '@/shared/ui/brand';

export function NavigationPanel() {
  return (
    <header className="bg-background/75 sticky top-0 z-20 backdrop-blur backdrop-saturate-200">
      <Wrapper className="py-0">
        <nav className="border-border flex items-center border-b py-2">
          <Link href={ROUTES.MAIN} className="rounded-full">
            <Brand />
          </Link>

          <ul className="flex flex-1 items-center justify-end gap-1">
            <ThemeSwitch />

            <NavigationPanelActions />
          </ul>
        </nav>
      </Wrapper>
    </header>
  );
}
