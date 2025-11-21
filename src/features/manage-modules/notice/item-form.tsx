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
} from '@/shared/lib/file-system';

import { CONFIG } from './config';
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
      const parentId = id || crypto.randomUUID();
      const { files, ...restValues } = values;

      // 1. 파일 업로드 처리 (새 파일 업로드 + 삭제 표시된 파일 삭제)
      await processFileUploads({
        tableName: CONFIG.tableName,
        parentId,
        files,
        handleDeletion: !!id, // update 시에만 삭제 처리
      });

      // 2. DB 저장 (파일 정보 제외)
      const { success, error } = id
        ? await updateItem({ id, values: restValues, path: pathname })
        : await createItem({ values: restValues, path: pathname });

      if (!success) {
        throw new Error(error || '저장에 실패했습니다.');
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
