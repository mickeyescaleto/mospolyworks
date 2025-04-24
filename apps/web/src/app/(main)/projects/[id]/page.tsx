import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectDetails } from '@/widgets/project-details';
import { ProjectService } from '@/entities/project';
import { Wrapper } from '@/shared/ui/wrapper';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const project = await ProjectService.getExhibitionProjectById(id).catch(
    () => null,
  );

  if (!project) {
    return {
      title: 'проект не найден',
    };
  }

  return {
    title: project.title,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await ProjectService.getExhibitionProjectById(id).catch(() =>
    notFound(),
  );

  return (
    <section>
      <Wrapper className="flex flex-col gap-4">
        <ProjectDetails project={project} />
      </Wrapper>
    </section>
  );
}
