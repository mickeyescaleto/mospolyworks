'use client';

import { useSearchParams } from 'next/navigation';

import { AnimatedBackground } from '@repo/ui/core/animated-background';
import { Button } from '@repo/ui/core/button';

import { QUERY_PARAMS } from '@/features/dashboard-tabs/constants/query-params';
import { TABS } from '@/features/dashboard-tabs/constants/tabs';

export function DashboardTabs() {
  const searchParams = useSearchParams();

  const param = searchParams.get(QUERY_PARAMS.TAB)?.toString();

  const firstTabValue = TABS[0].value;

  const value =
    param && TABS.find((tab) => tab.value === param) ? param : firstTabValue;

  const handleTabChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (value && params.has(QUERY_PARAMS.TAB, value)) {
      return;
    }

    if (value) {
      params.set(QUERY_PARAMS.TAB, value);
    } else {
      params.delete(QUERY_PARAMS.TAB);
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <div>
      <div className="bg-secondary inline-block rounded-full p-1">
        <AnimatedBackground
          defaultValue={value}
          onValueChange={(value) => handleTabChange(value)}
          className="bg-muted/50 rounded-full"
          transition={{
            ease: 'easeInOut',
            duration: 0.2,
          }}
        >
          {TABS.map((tab, index) => {
            return (
              <Button
                key={index}
                data-id={tab.value}
                type="button"
                variant="void"
                size="sm"
              >
                {tab.label}
              </Button>
            );
          })}
        </AnimatedBackground>
      </div>
    </div>
  );
}
