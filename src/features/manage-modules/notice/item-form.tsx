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
import { schemaPresets } from '@/shared/schemas/presets';
import { type FormFilesField } from '@/shared/lib/file-system';
import { handleFileUploads } from '../_base/utils';

import { CONFIG } from './config';
import { type ItemDTO } from './types';
import { createItem } from './actions/create-item';
import { updateItem } from './actions/update-item';

const formSchema = z.object({
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  createdAt: z.date().optional(),
  viewCount: schemaPresets.viewCount.optional(),
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  files: schemaPresets.files({ thumbnail: 1, attachments: 0 }),
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

      // 데이터 DB 저장
      const { success, data, error } = id
        ? await updateItem({ id, values: restValues, path: pathname })
        : await createItem({ values: restValues, path: pathname });

      if (!success || !data) {
        throw new Error(error || '저장에 실패했습니다.');
      }

      // 파일 업로드
      await handleFileUploads({
        formFiles: formFiles as FormFilesField,
        itemId: data.id,
        tableName: CONFIG.tableName,
        pathname,
        updateItemAction: updateItem,
      });
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
          presets
          optional
        />
        <FormNumberInput
          control={form.control}
          name='viewCount'
          label='조회수'
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
          optional
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
