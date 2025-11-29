'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldGroup } from '@/shared/ui/field';
import { FormTextInput, FormPasswordInput, FormRootError } from '@/shared/ui/form';
import { LoadingButton } from '@/shared/ui/loading-button';
import { AUTH_ERRORS } from '@/shared/constants/error-messages';
import { signIn } from '../actions';

const signInSchema = z.object({
  id: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});

const defaultValues = {
  id: '',
  password: '',
};

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signInSchema>>({
    defaultValues,
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setError(null);

    try {
      const result = await signIn(values);

      if (!result.success) {
        setError(AUTH_ERRORS.CREDENTIALS_SIGNIN);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('로그인 에러:', error);
      setError(AUTH_ERRORS.UNKNOWN_ERROR);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className='gap-y-6'>
        <FieldGroup className='gap-y-4'>
          <FormTextInput
            name='id'
            label='아이디'
            control={form.control}
            placeholder='아이디를 입력하세요'
            autoFocus
          />
          <FormPasswordInput
            name='password'
            label='비밀번호'
            control={form.control}
            placeholder='비밀번호를 입력하세요'
          />
        </FieldGroup>

        {error && <FormRootError>{error}</FormRootError>}

        <LoadingButton
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          로그인
        </LoadingButton>
      </FieldGroup>
    </form>
  );
}
