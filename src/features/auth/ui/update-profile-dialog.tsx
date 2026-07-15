'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { unstable_rethrow } from 'next/navigation';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { FieldGroup } from '@/shared/ui/field';
import { FormTextInput, FormPasswordInput, FormEmailInput, FormRootError } from '@/shared/ui/form';
import { LoadingButton } from '@/shared/ui/loading-button';
import { schemaPresets } from '@/shared/schemas';

import { signOut, useAuth, updateProfile, type UpdateProfileValues } from '@/features/auth';
import { updateProfileSchema } from '@/features/auth/schema';

import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { GENERAL_ERRORS } from '@/shared/constants/error-messages';
import { IS_DEMO, DEMO_MESSAGES } from '@/shared/lib/demo';
import { DemoOverlay } from '@/shared/ui/demo-overlay';
import { useDialog } from '@/shared/ui/app-dialog';

const formSchema = updateProfileSchema
  .extend({
    confirmPassword: schemaPresets.password({
      optional: true,
      strength: 'minimum',
    }),
  })
  .refine(
    (data) => {
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
    (data) => {
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

interface UpdateProfileDialogProps {
  children: React.ReactNode;
}

export function UpdateProfileDialog({ children }: UpdateProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const { user, updateSession } = useAuth();
  const dialog = useDialog();

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
        form.setError('root', {
          message: result.error,
        });
        return;
      }

      // 비밀번호 변경 여부에 따라 처리
      if (values.newPassword) {
        // 비밀번호 변경 시 로그아웃
        dialog.alert({
          title: (
            <>
              비밀번호가 변경되었습니다.
              <br />
              다시 로그인해주세요.
            </>
          ),
          variant: 'success',
          layout: 'vertical',
          size: 'sm',
          onConfirm: () => {
            signOut();
          },
        });

        return;
      }

      // 이름/이메일만 변경 시 세션 업데이트
      await updateSession({
        name: values.name,
        email: values.email,
      });

      toast.success(SUCCESS_MESSAGES.UPDATE_SUCCESS('프로필'));

      setOpen(false);
      form.reset({
        name: values.name,
        email: values.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      // signOut의 redirect는 내부적으로 에러 throw로 구현되어 catch에 걸림 — Next 내부 에러는 다시 던짐
      unstable_rethrow(error);
      console.error(error);

      form.setError('root', {
        message: GENERAL_ERRORS.UNEXPECTED,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>내 정보 수정</DialogTitle>
          <DialogDescription>본인의 정보를 수정할 수 있습니다.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <FormTextInput
              control={form.control}
              name="name"
              label="이름"
              placeholder="이름을 입력하세요"
            />

            <FormEmailInput
              control={form.control}
              name="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
            />
          </FieldGroup>

          <div className="relative">
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                비밀번호를 변경하려면 아래 필드를 입력하세요.
              </p>

              <FieldGroup>
                <FormPasswordInput
                  control={form.control}
                  name="currentPassword"
                  label="현재 비밀번호"
                  placeholder="현재 비밀번호"
                  autoComplete="current-password"
                  optional
                />

                <FormPasswordInput
                  control={form.control}
                  name="newPassword"
                  label="새 비밀번호"
                  placeholder="새 비밀번호 (최소 6자)"
                  autoComplete="new-password"
                  optional
                />

                <FormPasswordInput
                  control={form.control}
                  name="confirmPassword"
                  label="비밀번호 확인"
                  placeholder="비밀번호 확인"
                  autoComplete="new-password"
                  optional
                />
              </FieldGroup>
            </div>

            {IS_DEMO && (
              <DemoOverlay>
                <p className="text-sm text-muted-foreground px-4 text-center">
                  {DEMO_MESSAGES.PASSWORD_BLOCKED}
                </p>
              </DemoOverlay>
            )}
          </div>

          {form.formState.errors.root && (
            <FormRootError>{form.formState.errors.root.message}</FormRootError>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <LoadingButton type="submit" isLoading={form.formState.isSubmitting}>
              수정
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
