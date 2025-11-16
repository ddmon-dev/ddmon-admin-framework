'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FieldGroup } from '@/shared/ui/field';
import { FormInput } from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';

import { SignInLink } from './auth-links';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력해주세요.' })
    .email({ message: '올바른 이메일 주소를 입력해주세요.' }),
});

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    console.log('Forgot password form submitted:', values);
    setIsSuccess(true);
  }

  if (isSuccess) {
    return (
      <div className='space-y-4 text-center'>
        <div className='p-4 bg-primary/5 rounded-lg'>
          <p className='text-sm text-muted-foreground'>
            비밀번호 재설정 링크를 이메일로 전송했습니다.
          </p>
          <p className='text-sm text-muted-foreground mt-2'>
            이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정하세요.
          </p>
        </div>
        <SignInLink className='inline-block text-sm font-medium text-primary hover:underline'>
          로그인으로 돌아가기
        </SignInLink>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className='gap-y-6'>
        <FormInput
          name='email'
          label='이메일'
          control={form.control}
          type='email'
          placeholder='name@example.com'
          autoComplete='email'
        />

        <LoadingButton
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          비밀번호 재설정 링크 전송
        </LoadingButton>

        <div className='text-center text-sm'>
          <SignInLink className='font-medium text-primary hover:underline'>
            로그인으로 돌아가기
          </SignInLink>
        </div>
      </FieldGroup>
    </form>
  );
}
