import { type Metadata } from 'next';

import { EditProject } from '@/widgets/edit-project';

export const metadata: Metadata = {
  title: 'редактирование проекта',
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditProject projectId={id} />;
}
