'use client';

import { Fragment, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { cn } from '@repo/ui/utilities/cn';

import { editProjectFormSchema } from '@/widgets/edit-project/model/schemas';
import { EditProjectFormActions } from '@/widgets/edit-project/ui/edit-project-form-actions';
import { ImageUpload } from '@/widgets/edit-project/ui/image-upload';
import { EditableTitle } from '@/widgets/edit-project/ui/editable-title';
import { EditAlignmentButton } from '@/widgets/edit-project/ui/edit-alignment-button';
import { LazyEditorBlock } from '@/features/editor';
import { Project } from '@/entities/project/types/project';
import { useEditProject } from '@/entities/project';

type FormValues = z.infer<typeof editProjectFormSchema>;

type EditProjectFormProps = {
  project: Project;
};

export function EditProjectForm({ project }: EditProjectFormProps) {
  const { mutate: editProject } = useEditProject(project.id);

  const methods = useForm<FormValues>({
    resolver: zodResolver(editProjectFormSchema),
    shouldFocusError: false,
    defaultValues: {
      status: project.status,
      cover: project.cover || '',
      title: project.title || '',
      titleAlignment: project.titleAlignment || 'center',
      content: project.content || [],
      categoryId: project.category?.id || '',
      link: project.link || '',
      tags: project.tags.map((tag) => tag.id) || [],
      partners: project.partners.map((partner) => partner.id) || [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    control,
    watch,
    reset,
  } = methods;

  const formValues = watch();

  const categoryId = watch('categoryId');

  const canPublish = useMemo(() => {
    if (['published', 'verified'].includes(formValues.status)) {
      return false;
    }

    const result = editProjectFormSchema.safeParse({
      ...formValues,
      status: 'published',
    });

    return result.success;
  }, [formValues]);

  useEffect(() => {
    reset({
      status: project.status,
      cover: project.cover || '',
      title: project.title || '',
      titleAlignment: project.titleAlignment || 'center',
      content: project.content || [],
      categoryId: project.category?.id || '',
      link: project.link || '',
      tags: project.tags.map((tag) => tag.id) || [],
      partners: project.partners.map((partner) => partner.id) || [],
    });
  }, [project, reset]);

  async function handleFormSubmit(data: FormValues) {
    editProject(
      {
        cover: data.cover,
        title: data.title,
        titleAlignment: data.titleAlignment,
        content: JSON.stringify(data.content),
        categoryId: data.categoryId,
        link: data.link,
        partners: JSON.stringify(data.partners),
        tags: JSON.stringify(data.tags),
      },
      {
        onSuccess(data) {
          reset({
            status: data.status,
            cover: data.cover || '',
            title: data.title || '',
            titleAlignment: data.titleAlignment || 'center',
            content: data.content || [],
            categoryId: data.category?.id || '',
            link: data.link || '',
            tags: data.tags.map((tag) => tag.id) || [],
            partners: data.partners.map((partner) => partner.id) || [],
          });
        },
      },
    );
  }

  async function handleFormError() {
    toast.error(
      <Fragment>
        <p>Возникла ошибка!</p>
        <p>
          Проверьте обязательные поля: изображение, заголовок, контент и
          категория
        </p>
      </Fragment>,
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        id="edit-project-form"
        onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
      >
        <EditProjectFormActions
          projectId={project.id}
          projectStatus={formValues.status}
          isDirty={isDirty}
          isValid={isValid}
          canPublish={canPublish}
        />

        <div>
          <Controller
            name="cover"
            control={control}
            render={({ field }) => (
              <ImageUpload
                defaultImage={field.value}
                onChange={(file) => field.onChange(file)}
              />
            )}
          />

          <div className="lg:px-28">
            <div className="group relative mt-3 mb-0 lg:mt-3 lg:mb-0.5">
              <EditableTitle
                placeholder="Название проекта"
                maxLength={96}
                className={cn(
                  'hover:bg-secondary/50 focus:bg-secondary/50 ring-ring/5 peer header header-h1 hover:ring focus:ring',
                  {
                    'text-left': formValues.titleAlignment === 'left',
                    'text-center': formValues.titleAlignment === 'center',
                    'text-right': formValues.titleAlignment === 'right',
                    'text-justify': formValues.titleAlignment === 'justify',
                  },
                )}
                {...register('title')}
              />

              <EditAlignmentButton name="titleAlignment" />
            </div>

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <LazyEditorBlock
                  holder="editor"
                  data={{ blocks: field.value }}
                  onChange={(data) => field.onChange(data.blocks)}
                />
              )}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
