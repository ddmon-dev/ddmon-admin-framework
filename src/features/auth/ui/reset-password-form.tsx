'use client';

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

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: '비밀번호를 입력해주세요.' })
      .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
      }),
    confirmPassword: z.string().min(1, { message: '비밀번호 확인을 입력해주세요.' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export function ResetPasswordForm() {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    console.log('Reset password form submitted:', values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn('space-y-6')}>
          <div className={cn('space-y-4')}>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새 비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      placeholder='••••••••'
                      autoComplete='new-password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      placeholder='••••••••'
                      autoComplete='new-password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormSubmit
            className={cn('w-full')}
            size='lg'
          >
            비밀번호 변경
          </FormSubmit>
        </div>
      </form>
    </Form>
  );
}
