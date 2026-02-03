'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { FieldGroup } from '@/shared/ui/field';
import {
  FormRadioGroup,
  FormTextInput,
  FormNumberInput,
  FormEditor,
  FormFileUpload,
  FormDatePicker,
} from '@/shared/ui/form';
import { schemaPresets } from '@/shared/schemas';
import { type FormFilesField, uploadFormFiles } from '@/shared/lib/file-system';
import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { GENERAL_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';

import {
  useManageSheet,
  ManageSheetFooter,
  ManageFormSubmit,
  ManageSheetClose,
} from '../../_base/ui';
import { CONFIG } from './config';
import { type ItemDTO } from './config';
import { createItem, updateItem } from './actions';

const formSchema = z.object({
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  created_at: z.date().nullish(),
  view_count: schemaPresets.numberRange(),
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  files: schemaPresets.files({ thumbnail: 0, attachments: 0 }),
});

const formDefaultValues = {
  category: CONFIG.categoryOptions[0].value,
  created_at: new Date(),
  view_count: 0,
  title: '',
  content: '',
  files: undefined,
};

interface WriteFormProps {
  id?: string;
  prevValues: ItemDTO | null;
}

export function WriteForm({ id, prevValues }: WriteFormProps) {
  const sheet = useManageSheet();
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
      const { files: formFiles, ...restValues } = values;

      // 데이터 DB 저장
      const { success, data, error } = id
        ? await updateItem({ id, values: restValues as Partial<ItemDTO>, pathname })
        : await createItem({ values: restValues as Partial<ItemDTO>, pathname });

      if (!success || !data) {
        toast.error(error);
        return;
      }

      // 파일 업로드
      await uploadFormFiles({
        formFiles: formFiles as FormFilesField,
        id: data.id,
        tableName: CONFIG.tableName,
        pathname,
        updateAction: updateItem,
      });

      toast.success(id ? SUCCESS_MESSAGES.UPDATE_SUCCESS() : SUCCESS_MESSAGES.CREATE_SUCCESS());
      sheet.close();
    } catch (error) {
      console.error(error);
      toast.error(GENERAL_ERRORS.UNEXPECTED);
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
          name='created_at'
          label='작성일'
          mode='single'
          presets
          optional
        />
        <FormNumberInput
          control={form.control}
          name='view_count'
          label='조회수'
          thousandSeparator
        />
        <FormTextInput
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
      </FieldGroup>

      <ManageSheetFooter>
        <ManageSheetClose />
        <ManageFormSubmit isLoading={form.formState.isSubmitting} />
      </ManageSheetFooter>
    </form>
  );
}
