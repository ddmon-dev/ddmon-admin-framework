'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
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
import { SheetFooter, SheetBody, SheetContainer } from '@/shared/ui/sheet';
import { type FormFilesField, uploadFormFiles } from '@/shared/lib/file-system';
import { APP_CONFIG } from '@/app.config';
import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { GENERAL_ERRORS } from '@/shared/constants/error-messages';

import {
  useManageSheet,
  ManageFormSubmit,
  ManageSheetClose,
  ManageSheetModeChange,
} from '../_base/ui';
import { useFormGuard } from '../_base/hooks';
import { CONFIG } from './config';
import { type ItemDTO } from './config';
import { createItem, updateItem } from './actions';
import { writeSchema } from './schema';

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
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') || APP_CONFIG.LANG.DEFAULT;
  const form = useForm<z.infer<typeof writeSchema>>({
    resolver: zodResolver(writeSchema),
    defaultValues: (prevValues ?? formDefaultValues) as z.infer<typeof writeSchema>,
  });
  useFormGuard(form);

  useEffect(() => {
    form.reset((prevValues ?? formDefaultValues) as z.infer<typeof writeSchema>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValues]);

  async function onSubmit(values: z.infer<typeof writeSchema>) {
    try {
      const { files: formFiles, ...restValues } = values;

      // 1. 파일 업로드 선행 (실패 시 throw → DB 접근 없음)
      const filesMetadata = await uploadFormFiles({
        formFiles: formFiles as FormFilesField,
        tableName: CONFIG.tableName,
      });

      // 2. 메타데이터 포함해 단일 저장
      // 언어: 수정 시 기존값 유지, 생성 시 URL 파라미터 사용
      const submitValues = {
        ...restValues,
        ...(filesMetadata && { files: filesMetadata }),
        lang: prevValues?.lang ?? currentLang,
      } as Partial<ItemDTO>;

      const { success, data, error } = id
        ? await updateItem({ id, values: submitValues, pathname })
        : await createItem({ values: submitValues, pathname });

      if (!success || !data) {
        toast.error(error);
        return;
      }

      toast.success(id ? SUCCESS_MESSAGES.UPDATE_SUCCESS() : SUCCESS_MESSAGES.CREATE_SUCCESS());
      sheet.close();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : GENERAL_ERRORS.UNEXPECTED);
    }
  }

  return (
    <SheetBody>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SheetContainer>
          <FieldGroup>
            <FormRadioGroup
              control={form.control}
              name="category"
              label="카테고리"
              options={[...CONFIG.categoryOptions]}
            />
            <FormDatePicker
              control={form.control}
              name="created_at"
              label="작성일"
              mode="single"
              presets
              optional
            />
            <FormNumberInput
              control={form.control}
              name="view_count"
              label="조회수"
              thousandSeparator
            />
            <FormTextInput control={form.control} name="title" label="제목" />
            <FormEditor
              control={form.control}
              name="content"
              label="내용"
              entity={CONFIG.tableName}
            />
            <FormFileUpload
              control={form.control}
              name="files.thumbnail"
              label="썸네일"
              acceptPreset="images"
              maxSize={5}
              max={1}
            />
            <FormFileUpload
              control={form.control}
              name="files.attachments"
              label="첨부 파일"
              acceptPreset="documents"
              maxSize={10}
              max={5}
              optional
            />
          </FieldGroup>
        </SheetContainer>

        <SheetFooter>
          <ManageSheetClose />
          <ManageSheetModeChange mode="view" />
          <ManageFormSubmit isLoading={form.formState.isSubmitting} />
        </SheetFooter>
      </form>
    </SheetBody>
  );
}
