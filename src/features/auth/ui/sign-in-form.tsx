'use client';

import { cn } from '@/shared/utils/classnames';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { LoadingButton } from '@/shared/ui/loading-button';
import { ForgotPasswordLink } from './auth-links';

import { FormInput } from '@/shared/ui/form-templates';

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
      <FieldGroup className={cn('gap-y-6')}>
        <FieldGroup className={cn('gap-y-4')}>
          <FormInput
            name='id'
            label='아이디'
            control={form.control}
          />
          <FormInput
            name='password'
            label='비밀번호'
            type='password'
            control={form.control}
          />
        </FieldGroup>

        <LoadingButton
          type='submit'
          className={cn('w-full')}
          tabIndex={3}
          isLoading={form.formState.isSubmitting}
        >
          Log-in
        </LoadingButton>
      </FieldGroup>
    </form>
  );
}
