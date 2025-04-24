import { DashboardDetails } from '@/widgets/dashboard-details';
import { DashboardTabs } from '@/features/dashboard-tabs';
import { Wrapper } from '@/shared/ui/wrapper';
import { Heading } from '@/shared/ui/heading';

export default async function DashboardPage() {
  return (
    <section>
      <Wrapper className="flex flex-col gap-4">
        <Heading>Панель управления</Heading>

        <DashboardTabs />

        <DashboardDetails />
      </Wrapper>
    </section>
  );
}
