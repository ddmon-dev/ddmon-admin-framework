'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { LoadingButton } from '@/shared/ui/loading-button';
import { cn } from '@/shared/utils/classnames';

// 개발 환경인지 확인
const isDevelopment = process.env.NODE_ENV === 'development';

const initialSetupSchema = z
  .object({
    email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 주소를 입력해주세요'),
    password: isDevelopment
      ? z
          .string()
          .min(1, '비밀번호를 입력해주세요')
          .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
          .regex(/[a-zA-Z]/, '비밀번호는 영문자를 포함해야 합니다')
      : z
          .string()
          .min(1, '비밀번호를 입력해주세요')
          .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
          .regex(/[a-zA-Z]/, '비밀번호는 영문자를 포함해야 합니다'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    fullName: z.string().min(1, '이름을 입력해주세요').min(2, '이름은 최소 2자 이상이어야 합니다'),
    department: z.string().optional(),
    position: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type InitialSetupFormValues = z.infer<typeof initialSetupSchema>;

export function InitialSetupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InitialSetupFormValues>({
    resolver: zodResolver(initialSetupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      department: '',
      position: '',
    },
  });

  async function onSubmit(values: InitialSetupFormValues) {
    setIsLoading(true);

    try {
      console.log('Initial setup form submitted:', values);
      toast.success('최고관리자가 성공적으로 생성되었습니다');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6')}
      >
        <div className={cn('space-y-4')}>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='text'
                    placeholder='홍길동'
                    autoComplete='name'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder='admin@example.com'
                    autoComplete='email'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='••••••••'
                    autoComplete='new-password'
                  />
                </FormControl>
                <FormDescription className={cn('text-xs')}>
                  {isDevelopment
                    ? '개발 모드: 영문자 포함 6자 이상 (숫자, 특수문자 선택)'
                    : '영문자 포함 8자 이상 (숫자, 특수문자 선택)'}
                </FormDescription>
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

          <FormField
            control={form.control}
            name='department'
            render={({ field }) => (
              <FormItem>
                <FormLabel>부서 (선택)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='text'
                    placeholder='시스템 관리팀'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='position'
            render={({ field }) => (
              <FormItem>
                <FormLabel>직책 (선택)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='text'
                    placeholder='시스템 관리자'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <LoadingButton
          type='submit'
          className={cn('w-full')}
          size='lg'
          isLoading={isLoading}
        >
          최고관리자 생성
        </LoadingButton>

        <div className={cn('text-center text-sm text-muted-foreground')}>
          <p>⚠️ 이 계정은 시스템의 모든 권한을 가집니다</p>
          <p>한 명만 존재할 수 있으며 최초 설정 후 이 페이지는 접근할 수 없습니다</p>
        </div>
      </form>
    </Form>
  );
}
