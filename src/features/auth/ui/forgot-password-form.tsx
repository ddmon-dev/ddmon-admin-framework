'use client';

import { useState } from 'react';
import { cn } from '@/shared/utils/classnames';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSubmit,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

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
      <div className={cn('space-y-4 text-center')}>
        <div className={cn('p-4 bg-primary/5 rounded-lg')}>
          <p className={cn('text-sm text-muted-foreground')}>
            비밀번호 재설정 링크를 이메일로 전송했습니다.
          </p>
          <p className={cn('text-sm text-muted-foreground mt-2')}>
            이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정하세요.
          </p>
        </div>
        <SignInLink className={cn('inline-block text-sm font-medium text-primary hover:underline')}>
          로그인으로 돌아가기
        </SignInLink>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn('space-y-6')}>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    placeholder='name@example.com'
                    autoComplete='email'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormSubmit
            className={cn('w-full')}
            variant='default'
          >
            비밀번호 재설정 링크 전송
          </FormSubmit>

          <div className={cn('text-center text-sm')}>
            <SignInLink className={cn('font-medium text-primary hover:underline')}>
              로그인으로 돌아가기
            </SignInLink>
          </div>
        </div>
      </form>
    </Form>
  );
}
