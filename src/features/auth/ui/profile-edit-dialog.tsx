'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { FieldGroup } from '@/shared/ui/field';
import { FormTextInput, FormPasswordInput, FormEmailInput } from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';
import { schemaPresets } from '@/shared/schemas';

import { useAuth } from '../hooks/use-auth';
import { updateProfile } from '../actions/update-profile';
import { type UpdateProfileValues } from '../types';

const formSchema = z
  .object({
    name: z.string().min(3, '이름은 3자 이상 입력해야 합니다.'),
    email: schemaPresets.email(),
    currentPassword: schemaPresets.password({
      optional: true,
      strength: 'minimum',
    }),
    newPassword: schemaPresets.password({
      optional: true,
      strength: 'minimum',
    }),
    confirmPassword: schemaPresets.password({
      optional: true,
      strength: 'minimum',
    }),
  })
  .refine(
    data => {
      // newPassword 입력 시 currentPassword 필수
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: '현재 비밀번호를 입력하세요.',
      path: ['currentPassword'],
    }
  )
  .refine(
    data => {
      // newPassword와 confirmPassword 일치
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: '비밀번호가 일치하지 않습니다.',
      path: ['confirmPassword'],
    }
  );

type FormValues = z.infer<typeof formSchema>;

interface ProfileEditDialogProps {
  children: React.ReactNode;
}

export function ProfileEditDialog({ children }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const { user, update } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // 빈 문자열을 undefined로 변환
      const submitValues: UpdateProfileValues = {
        name: values.name,
        email: values.email,
        currentPassword: values.currentPassword || undefined,
        newPassword: values.newPassword || undefined,
        confirmPassword: values.confirmPassword || undefined,
      };

      const result = await updateProfile(submitValues);

      if (!result.success) {
        alert(result.error || '프로필 수정에 실패했습니다.');
        return;
      }

      // 세션 업데이트 (name, email 변경 반영)
      await update({
        name: values.name,
        email: values.email,
      });

      alert('프로필이 성공적으로 수정되었습니다.');

      setOpen(false);
      form.reset({
        name: values.name,
        email: values.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error(error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>내 정보 수정</DialogTitle>
          <DialogDescription>본인의 정보를 수정할 수 있습니다.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FieldGroup>
            <FormTextInput
              control={form.control}
              name='name'
              label='이름'
              placeholder='이름을 입력하세요'
            />

            <FormEmailInput
              control={form.control}
              name='email'
              label='이메일'
              placeholder='이메일을 입력하세요'
            />
          </FieldGroup>

          <div className='border-t pt-4'>
            <p className='text-sm text-muted-foreground mb-3'>
              비밀번호를 변경하려면 아래 필드를 입력하세요.
            </p>

            <FieldGroup>
              <FormPasswordInput
                control={form.control}
                name='currentPassword'
                label='현재 비밀번호'
                placeholder='현재 비밀번호'
                autoComplete='current-password'
                optional
              />

              <FormPasswordInput
                control={form.control}
                name='newPassword'
                label='새 비밀번호'
                placeholder='새 비밀번호 (최소 6자)'
                autoComplete='new-password'
                optional
              />

              <FormPasswordInput
                control={form.control}
                name='confirmPassword'
                label='비밀번호 확인'
                placeholder='비밀번호 확인'
                autoComplete='new-password'
                optional
              />
            </FieldGroup>
          </div>

          <div className='flex justify-end gap-2 pt-4'>
            <Button type='button' variant='outline' onClick={() => setOpen(false)}>
              취소
            </Button>
            <LoadingButton type='submit' isLoading={form.formState.isSubmitting}>
              수정
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
