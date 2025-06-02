import { ProjectForReviewDetails } from '@/widgets/project-for-review-details';
import { Wrapper } from '@/shared/ui/wrapper';

export default async function ProjectForReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section>
      <Wrapper className="flex flex-col gap-4">
        <ProjectForReviewDetails projectId={id} />
      </Wrapper>
    </section>
  );
}
