'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { FieldGroup } from '@/shared/ui/field';
import { FormInput, FormEditor } from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';

import { createItem } from './actions/create-item';
import { updateItem } from './actions/update-item';
import { type RowData, type ItemDTO } from './types';

const formSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
});

const formDefaultValues = {
  title: '',
  content: '',
};

interface ItemFormProps {
  id?: RowData['id'] | null;
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
  }, [prevValues, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { success, error } = id
      ? await updateItem({ id, values, path: pathname })
      : await createItem({ values, path: pathname });

    if (!success) {
      console.error(error);
      return;
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
