'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldGroup } from '@/shared/ui/field';
import { FormTextInput, FormPasswordInput } from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';
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
        setError(result.error || '로그인에 실패했습니다.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('로그인 에러:', error);
      setError('로그인 중 오류가 발생했습니다.');
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
            autoComplete='username'
            autoFocus
          />
          <FormPasswordInput
            name='password'
            label='비밀번호'
            control={form.control}
            placeholder='비밀번호를 입력하세요'
            autoComplete='current-password'
          />
        </FieldGroup>

        {error && (
          <div className='rounded-md bg-destructive/15 p-3 text-sm text-destructive'>{error}</div>
        )}

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
