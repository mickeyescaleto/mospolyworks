'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Input } from '@repo/ui/core/input';

import { ColoredAvatar } from '@/shared/ui/colored-avatar';

interface AvatarUploadProps {
  defaultImage: File | string | null;
  fallback: string;
  onChange: (file?: File) => void;
}

export function AvatarUpload({
  defaultImage,
  fallback,
  onChange,
}: AvatarUploadProps) {
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
    <div className="flex justify-center">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />

      <label
        htmlFor="file-upload"
        className="group relative inline-flex cursor-pointer"
      >
        <ColoredAvatar
          src={preview || ''}
          alt="User avatar"
          fallback={fallback}
          classNames={{
            avatar: 'size-32 rounded-full md:size-40',
            fallback: 'text-2xl rounded-full',
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-full bg-black/50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <p className="text-center text-sm text-white">Изменить изображение</p>
        </div>
      </label>
    </div>
  );
}
