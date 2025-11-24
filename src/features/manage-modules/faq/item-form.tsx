'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { FieldGroup } from '@/shared/ui/field';
import { FormTextInput, FormTextarea, FormDatePicker } from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';

import { type ItemDTO } from './types';
import { createItem, updateItem } from './actions';

const formSchema = z.object({
  createdAt: z.date().nullish(),
  question: z.string().min(1, '질문을 입력해주세요.'),
  answer: z.string().min(1, '답변을 입력해주세요.'),
});

const formDefaultValues = {
  createdAt: new Date(),
  question: '',
  answer: '',
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
      const submitValues = values;

      // 데이터 DB 저장
      const { success, data, error } = id
        ? await updateItem({ id, values: submitValues as Partial<ItemDTO>, pathname })
        : await createItem({ values: submitValues as Partial<ItemDTO>, pathname });

      if (!success || !data) {
        throw new Error(error || '저장에 실패했습니다.');
      }

      alert('저장되었습니다.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '저장에 실패했습니다.');
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-6'
    >
      {/* 기본 정보 */}
      <FieldGroup>
        <FormDatePicker
          control={form.control}
          name='createdAt'
          label='작성일'
          mode='single'
          presets
          optional
        />

        <FormTextInput
          control={form.control}
          name='question'
          label='질문'
          placeholder='질문을 입력해주세요.'
        />

        <FormTextarea
          control={form.control}
          name='answer'
          label='답변'
          placeholder='답변을 입력해주세요.'
        />
      </FieldGroup>

      {/* 제출 버튼 */}
      <div className='flex justify-end gap-2 pt-4'>
        <LoadingButton
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          {id ? '수정' : '생성'}
        </LoadingButton>
      </div>
    </form>
  );
}
