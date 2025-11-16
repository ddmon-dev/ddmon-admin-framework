'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FieldGroup } from '@/shared/ui/field';
import { FormInput } from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';

const signInSchema = z.object({
  id: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z
    .string()
    .min(1, { message: '비밀번호를 입력해주세요.' })
    .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' }),
});

const defaultValues = {
  id: '',
  password: '',
};

export function SignInForm() {
  const form = useForm<z.infer<typeof signInSchema>>({
    defaultValues,
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    console.log('Sign in form submitted:', values);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className='gap-y-6'>
        <FieldGroup className='gap-y-4'>
          <FormInput
            name='id'
            label='아이디'
            control={form.control}
            type='email'
            placeholder='아이디를 입력하세요'
            autoComplete='username'
            autoFocus
          />
          <FormInput
            name='password'
            label='비밀번호'
            control={form.control}
            type='password'
            placeholder='비밀번호를 입력하세요'
            autoComplete='current-password'
          />
        </FieldGroup>

        <LoadingButton
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          Log-in
        </LoadingButton>
      </FieldGroup>
    </form>
  );
}
