'use client';

import { Button } from '@repo/ui/core/button';

import { type ProjectForReview, useApproveProject } from '@/entities/project';

type ApproveProjectButtonProps = {
  project: ProjectForReview;
};

export function ApproveProjectButton({ project }: ApproveProjectButtonProps) {
  const { mutate: approveProject } = useApproveProject();

  return <Button onClick={() => approveProject(project.id)}>Одобрить</Button>;
}
