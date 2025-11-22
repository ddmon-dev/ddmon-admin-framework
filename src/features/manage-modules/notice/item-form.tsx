'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { FieldGroup } from '@/shared/ui/field';
import {
  FormRadioGroup,
  FormInput,
  FormNumberInput,
  FormEditor,
  FormFileUpload,
  FormDatePicker,
} from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';
import {
  processFileUploads,
  createFilesSchema,
  type FormFilesField,
} from '@/shared/lib/file-system';

import { CONFIG } from './config';
import { type ItemDTO } from './types';
import { createItem } from './actions/create-item';
import { updateItem } from './actions/update-item';

const formSchema = z.object({
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  createdAt: z.date().optional(),
  viewCount: z
    .number()
    .min(0, { message: '조회수는 0 이상이어야 합니다.' })
    .max(999999999, { message: '조회수는 0 이상 999999999 이하여야 합니다.' })
    .optional(),
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  files: createFilesSchema(['thumbnail', 'attachments']),
});

const formDefaultValues = {
  category: CONFIG.categoryOptions[0].value,
  createdAt: new Date(),
  viewCount: 0,
  title: '',
  content: '',
  files: undefined,
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
    console.log(values);
    try {
      const { files: formFiles, ...restValues } = values;

      // 파일 유무 체크
      const hasFormFiles =
        formFiles &&
        Object.values(formFiles).some(fileList => Array.isArray(fileList) && fileList.length > 0);

      // 데이터 DB 저장
      const { success, data, error } = id
        ? await updateItem({ id, values: restValues, path: pathname })
        : await createItem({ values: restValues, path: pathname });

      if (!success || !data) {
        throw new Error(error || '저장에 실패했습니다.');
      }

      // 파일 업로드
      if (hasFormFiles) {
        const uploadedFilesMetadata = await processFileUploads({
          files: formFiles as FormFilesField,
          folder: `${CONFIG.tableName}/${data.id}`,
        });

        // files JSONB 컬럼 업데이트
        if (Object.keys(uploadedFilesMetadata).length > 0) {
          await updateItem({
            id: data.id,
            values: { files: uploadedFilesMetadata },
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
        <FormRadioGroup
          control={form.control}
          name='category'
          label='카테고리'
          options={[...CONFIG.categoryOptions]}
        />
        <FormDatePicker
          control={form.control}
          name='createdAt'
          label='작성일'
          mode='single'
          presets={true}
        />
        <FormNumberInput
          control={form.control}
          name='viewCount'
          label='조회수'
          min={0}
          thousandSeparator
        />
        <FormInput
          control={form.control}
          name='title'
          label='제목'
        />
        <FormEditor
          control={form.control}
          name='content'
          label='내용'
          entity={CONFIG.tableName}
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
