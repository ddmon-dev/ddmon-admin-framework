'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { FieldGroup } from '@/shared/ui/field';
import { FormRadioGroup, FormTextInput, FormTextarea } from '@/shared/ui/form';
import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { GENERAL_ERRORS } from '@/shared/constants/error-messages';

import {
  useManageSheet,
  ManageSheetFooter,
  ManageFormSubmit,
  ManageSheetClose,
} from '../_base/ui';
import { CONFIG, type ItemDTO } from './config';
import { createItem, updateItem } from './actions';
import { writeSchema } from './schema';

const formSchema = writeSchema;

const formDefaultValues = {
  category: CONFIG.categoryOptions[0].value,
  question: '',
  answer: '',
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

  useEffect(() => {
    form.reset((prevValues ?? formDefaultValues) as z.infer<typeof formSchema>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValues]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const submitValues = values;

      // 데이터 DB 저장
      const { success, data, error } = id
        ? await updateItem({
            id,
            values: submitValues as Partial<ItemDTO>,
            pathname,
          })
        : await createItem({
            values: submitValues as Partial<ItemDTO>,
            pathname,
          });

      if (!success || !data) {
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <FieldGroup>
        <FormRadioGroup
          control={form.control}
          name="category"
          label="카테고리"
          options={[...CONFIG.categoryOptions]}
        />

        <FormTextInput
          control={form.control}
          name="question"
          label="질문"
          placeholder="질문을 입력해주세요."
        />

        <FormTextarea
          control={form.control}
          name="answer"
          label="답변"
          placeholder="답변을 입력해주세요."
        />
      </FieldGroup>

      <ManageSheetFooter>
        <ManageSheetClose />
        <ManageFormSubmit isLoading={form.formState.isSubmitting} />
      </ManageSheetFooter>
    </form>
  );
}
