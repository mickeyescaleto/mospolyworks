'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ImageIcon } from '@repo/ui/core/icons';
import { Input } from '@repo/ui/core/input';

import { ProjectCover } from '@/entities/project';

interface ImageUploadProps {
  defaultImage: File | string | null;
  onChange: (file?: File) => void;
}

export function ImageUpload({ defaultImage, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof defaultImage === 'string') {
      setPreview(defaultImage);
    }
  }, [defaultImage]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Файл должен быть изображением');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      onChange(undefined);
    }
  };

  return (
    <div>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />

      <label htmlFor="file-upload" className="group relative cursor-pointer">
        <ProjectCover cover={preview || undefined} />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <ImageIcon strokeWidth={1} className="size-24 text-zinc-400" />

          <p className="text-white">Загрузить изображение</p>

          <p className="text-sm text-zinc-400">
            (рекомендуемое разрешение: 1248x702)
          </p>
        </div>
      </label>
    </div>
  );
}
