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
  FormDescription,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import Link from 'next/link';
import { SignInLink, AUTH_ROUTES } from './auth-links';
import { OAuthButtons } from './oauth-buttons';
import { DividerWithText } from '../../../shared/ui/divider-with-text';

// 개발 환경인지 확인
const isDevelopment = process.env.NODE_ENV === 'development';

const signupFormSchema = z
  .object({
    nickname: z
      .string()
      .min(1, { message: '닉네임을 입력해주세요.' })
      .min(3, { message: '닉네임은 최소 3자 이상이어야 합니다.' })
      .regex(/^[a-zA-Z0-9_-]+$/, { message: '영문, 숫자, _, - 만 사용 가능합니다.' }),
    email: z
      .string()
      .min(1, { message: '이메일을 입력해주세요.' })
      .email({ message: '올바른 이메일 주소를 입력해주세요.' }),
    password: isDevelopment
      ? z
          .string()
          .min(1, { message: '비밀번호를 입력해주세요.' })
          .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
      : z
          .string()
          .min(1, { message: '비밀번호를 입력해주세요.' })
          .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
          .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
            message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
          }),
    confirmPassword: z.string().min(1, { message: '비밀번호 확인을 입력해주세요.' }),
    agreeToTerms: z.boolean().refine(val => val === true, {
      message: '서비스 이용약관에 동의해주세요.',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export function SignupForm() {
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof signupFormSchema>) {
    console.log('Signup form submitted:', values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn('space-y-6')}>
          <OAuthButtons
            isLoading={form.formState.isSubmitting}
            mode='signup'
          />

          <DividerWithText />

          <div className={cn('space-y-4')}>
            <FormField
              control={form.control}
              name='nickname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      placeholder='nickname123'
                      autoComplete='username'
                    />
                  </FormControl>
                  <FormDescription className='text-xs'>
                    영문, 숫자, _, - 만 사용 가능합니다
                  </FormDescription>
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
                      placeholder='name@example.com'
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
                      ? '개발 모드: 6자 이상'
                      : '영문, 숫자, 특수문자를 포함하여 8자 이상'}
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
              name='agreeToTerms'
              render={({ field }) => (
                <FormItem>
                  <div className={cn('flex items-start space-x-3')}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={cn('mt-0.5')}
                      />
                    </FormControl>
                    <div className={cn('leading-none')}>
                      <FormLabel
                        className={cn(
                          'text-sm font-normal text-muted-foreground cursor-pointer block'
                        )}
                      >
                        <Link
                          href={AUTH_ROUTES.terms}
                          className={cn('underline hover:text-primary')}
                        >
                          서비스 이용약관
                        </Link>
                        과{' '}
                        <Link
                          href={AUTH_ROUTES.privacy}
                          className={cn('underline hover:text-primary')}
                        >
                          개인정보 처리방침
                        </Link>
                        에 동의합니다
                      </FormLabel>
                    </div>
                  </div>
                  <FormMessage className={cn('mt-2')} />
                </FormItem>
              )}
            />
          </div>

          <FormSubmit
            className={cn('w-full')}
            size='lg'
          >
            회원가입
          </FormSubmit>

          <div className={cn('text-center text-sm')}>
            <span className={cn('text-muted-foreground')}>이미 계정이 있으신가요? </span>
            <SignInLink className={cn('font-medium text-primary hover:underline')} />
          </div>
        </div>
      </form>
    </Form>
  );
}
