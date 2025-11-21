'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { FieldGroup } from '@/shared/ui/field';
import { FormInput, FormEditor, FormFileUpload } from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';
import {
  processFileUploads,
  createFilesSchema,
  type FileUploadValue,
} from '@/shared/lib/file-system';

import { createItem } from './actions/create-item';
import { updateItem } from './actions/update-item';
import { type ItemDTO } from './types';

const formSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  ...createFilesSchema(['thumbnail', 'attachments']),
});

const formDefaultValues = {
  title: '',
  content: '',
  files: {
    thumbnail: [],
    attachments: [],
  },
};

interface ItemFormProps {
  id?: string;
  prevValues: ItemDTO | null;
}

export function ItemForm({ id, prevValues }: ItemFormProps) {
  const pathname = usePathname();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: (prevValues ?? formDefaultValues) as z.infer<typeof formSchema>,
  });

  useEffect(() => {
    form.reset((prevValues ?? formDefaultValues) as z.infer<typeof formSchema>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValues]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { files, ...restValues } = values;

      // 실제 파일이 있는지 확인
      const hasFiles =
        files &&
        Object.values(files).some(fileList => Array.isArray(fileList) && fileList.length > 0);

      // 1. DB 먼저 저장 (DB가 UUID 생성)
      const { success, data, error } = id
        ? await updateItem({ id, values: restValues, path: pathname })
        : await createItem({ values: restValues, path: pathname });

      if (!success || !data) {
        throw new Error(error || '저장에 실패했습니다.');
      }

      // 2. 파일 업로드 (실제 파일이 있을 때만)
      if (hasFiles) {
        const uploadedFiles = await processFileUploads({
          files: files as Record<string, FileUploadValue[]>,
          folder: `notices/${data.id}`,
        });

        // 3. files JSONB 컬럼 업데이트 (업로드된 파일이 있을 때만)
        if (Object.keys(uploadedFiles).length > 0) {
          await updateItem({
            id: data.id,
            values: { files: uploadedFiles } as any,
            path: pathname,
          });
        }
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '저장에 실패했습니다.');
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name='title'
          label='제목'
        />
        <FormEditor
          control={form.control}
          name='content'
          label='내용'
        />
        <FormFileUpload
          control={form.control}
          name='files.thumbnail'
          label='썸네일'
          acceptPreset='images'
          maxSize={5}
          max={1}
        />
        <FormFileUpload
          control={form.control}
          name='files.attachments'
          label='첨부 파일'
          acceptPreset='documents'
          maxSize={10}
          max={5}
        />

        <LoadingButton
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          저장
        </LoadingButton>
      </FieldGroup>
    </form>
  );
}
