'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { FieldGroup } from '@/shared/ui/field';
import { FormInput, FormTextarea } from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';

const formSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
});

const formDefaultValues = {
  title: '',
};

interface ItemFormProps {
  prevValues: z.infer<typeof formSchema> | null;
}

export function ItemForm({ prevValues }: ItemFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: prevValues ?? formDefaultValues,
  });

  useEffect(() => {
    form.reset(prevValues ?? formDefaultValues);
  }, [prevValues]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name='title'
          label='제목'
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
