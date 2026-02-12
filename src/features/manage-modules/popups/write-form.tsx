'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { addDays } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FieldGroup } from '@/shared/ui/field';
import {
  FormTextInput,
  FormNumberInput,
  FormSwitch,
  FormDatePicker,
  FormEditor,
} from '@/shared/ui/form';

import {
  useManageSheet,
  ManageSheetFooter,
  ManageFormSubmit,
  ManageSheetClose,
} from '../_base/ui';
import { useFormGuard } from '../_base/hooks';
import { CONFIG } from './config';
import { type ItemDTO } from './config';
import { createItem, updateItem } from './actions';
import { writeSchema } from './schema';

import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { GENERAL_ERRORS } from '@/shared/constants/error-messages';

const formSchema = writeSchema;

const formDefaultValues = {
  title: '',
  content: '',
  position_top: 100,
  position_left: 100,
  width: 400,
  is_active: false,
  is_always: false,
  start_date: new Date(),
  end_date: addDays(new Date(), 7),
  z_index: 10,
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
    defaultValues: (prevValues ?? formDefaultValues) as z.infer<
      typeof formSchema
    >,
  });
  useFormGuard(form);

  useEffect(() => {
    form.reset((prevValues ?? formDefaultValues) as z.infer<typeof formSchema>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValues]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { success, error } = id
        ? await updateItem({
            id,
            values: values as Partial<ItemDTO>,
            pathname,
          })
        : await createItem({
            values: values as Partial<ItemDTO>,
            pathname,
          });

      if (!success) {
        toast.error(error);
        return;
      }

      toast.success(
        id
          ? SUCCESS_MESSAGES.UPDATE_SUCCESS()
          : SUCCESS_MESSAGES.CREATE_SUCCESS()
      );
      sheet.close();
    } catch (error) {
      console.error(error);
      toast.error(GENERAL_ERRORS.UNEXPECTED);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormTextInput
          control={form.control}
          name="title"
          label="제목"
          placeholder="팝업 제목을 입력하세요"
        />

        <FormSwitch control={form.control} name="is_active" label="노출 여부" />
      </FieldGroup>

      <FieldGroup>
        <FormSwitch
          control={form.control}
          name="is_always"
          label="항시노출 (기간 무시)"
        />

        <FormDatePicker
          control={form.control}
          name="start_date"
          label="시작일"
          optional
        />

        <FormDatePicker
          control={form.control}
          name="end_date"
          label="종료일"
          optional
        />
      </FieldGroup>

      <FieldGroup>
        <FormNumberInput
          control={form.control}
          name="position_top"
          label="상단 위치 (px)"
          suffix="px"
        />

        <FormNumberInput
          control={form.control}
          name="position_left"
          label="좌측 위치 (px)"
          suffix="px"
        />

        <FormNumberInput
          control={form.control}
          name="width"
          label="팝업 너비 (px)"
          suffix="px"
        />

        <FormNumberInput
          control={form.control}
          name="z_index"
          label="팝업레이어 순서"
          description="작은 숫자일수록 다른 팝업보다 위에 표시됩니다."
        />
      </FieldGroup>

      <FieldGroup>
        <FormEditor
          control={form.control}
          name="content"
          label="팝업 내용"
          entity={CONFIG.tableName}
        />
      </FieldGroup>

      {/* 제출 버튼 */}
      <ManageSheetFooter>
        <ManageSheetClose />
        <ManageFormSubmit isLoading={form.formState.isSubmitting} />
      </ManageSheetFooter>
    </form>
  );
}
