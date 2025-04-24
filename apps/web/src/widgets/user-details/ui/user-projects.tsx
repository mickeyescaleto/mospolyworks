'use client';

import { useState } from 'react';

import { AnimatedBackground } from '@repo/ui/core/animated-background';
import { Button } from '@repo/ui/core/button';

import { ExhibitionProjects } from '@/widgets/exhibition-projects';
import { Projects } from '@/widgets/projects';
import { useAccount } from '@/entities/account';

type UserProjectsProps = {
  userId: string;
};

export function UserProjects({ userId }: UserProjectsProps) {
  const tabs = [
    { value: 'author', title: 'Авториские' },
    { value: 'contributor', title: 'Совместные' },
  ];

  const [currentTab, setCurrentTab] = useState<string>(tabs[0]?.value || '');

  const { data: account } = useAccount();

  if (account?.id === userId) {
    tabs.push({ value: 'drafts', title: 'Черновики' });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="bg-secondary inline-block rounded-full p-1">
          <AnimatedBackground
            defaultValue={currentTab}
            onValueChange={(newValue) => {
              if (newValue && newValue !== currentTab) {
                setCurrentTab(newValue);
              }
            }}
            className="bg-muted/50 rounded-full"
            transition={{
              ease: 'easeInOut',
              duration: 0.2,
            }}
          >
            {tabs.map((tab, index) => {
              return (
                <Button
                  key={index}
                  data-id={tab.value}
                  type="button"
                  variant="void"
                  size="sm"
                >
                  {tab.title}
                </Button>
              );
            })}
          </AnimatedBackground>
        </div>
      </div>

      {currentTab === 'author' ? (
        <ExhibitionProjects queryKey={userId} author={userId} />
      ) : currentTab === 'contributor' ? (
        <ExhibitionProjects queryKey={userId} contributor={userId} />
      ) : (
        <Projects queryKey={userId} />
      )}
    </div>
  );
}
