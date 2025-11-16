'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FieldGroup } from '@/shared/ui/field';
import { FormInput, FormCheckbox } from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';
import { DividerWithText } from '@/shared/ui/divider-with-text';

import { SignInLink, AUTH_ROUTES } from './auth-links';
import { OAuthButtons } from './oauth-buttons';

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
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className='gap-y-6'>
        <OAuthButtons
          isLoading={form.formState.isSubmitting}
          mode='signup'
        />

        <DividerWithText />

        <FieldGroup className='gap-y-4'>
          <FormInput
            control={form.control}
            name='nickname'
            label='닉네임'
            placeholder=''
          />

          <FormInput
            control={form.control}
            name='email'
            label='이메일'
            placeholder='name@example.com'
          />

          <FormInput
            control={form.control}
            name='password'
            label='비밀번호'
            placeholder='••••••••'
          />

          <FormInput
            control={form.control}
            name='confirmPassword'
            label='비밀번호 확인'
            placeholder='••••••••'
          />

          <FormCheckbox
            control={form.control}
            name='agreeToTerms'
            label={
              <span className='font-normal cursor-pointer'>
                <Link
                  href={AUTH_ROUTES.terms}
                  className='underline hover:text-primary'
                >
                  서비스 이용약관
                </Link>
                과{' '}
                <Link
                  href={AUTH_ROUTES.privacy}
                  className='underline hover:text-primary'
                >
                  개인정보 처리방침
                </Link>
                에 동의합니다
              </span>
            }
          />
        </FieldGroup>

        <LoadingButton
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          회원가입
        </LoadingButton>

        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>이미 계정이 있으신가요? </span>
          <SignInLink className='font-medium text-primary hover:underline' />
        </div>
      </FieldGroup>
    </form>
  );
}
