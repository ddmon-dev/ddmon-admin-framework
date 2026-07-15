'use client';

import { APP_CONFIG } from '@/app.config';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { FieldGroup } from '@/shared/ui/field';
import { FormTextInput, FormPasswordInput, FormEmailInput } from '@/shared/ui/form';
import { SheetFooter, SheetBody, SheetContainer } from '@/shared/ui/sheet';
import { schemaPresets } from '@/shared/schemas';
import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { GENERAL_ERRORS } from '@/shared/constants/error-messages';
import { IS_DEMO, DEMO_MESSAGES } from '@/shared/lib/demo';
import { DemoOverlay, DemoOverlayMessage } from '@/shared/ui/demo-overlay';

import { useManageSheet, ManageFormSubmit, ManageSheetClose } from '../_base/ui';
import { useFormGuard } from '../_base/hooks';
import { type ItemDTO } from './config';
import { createItem, updateItem } from './actions';
import { createSchema, updateSchema } from './schema';

const createFormSchema = (isEdit: boolean) => {
  const baseSchema = isEdit
    ? updateSchema.extend({
        id: z.string(),
        confirmPassword: schemaPresets.password({
          optional: true,
          strength: APP_CONFIG.AUTH.PASSWORD_STRENGTH,
        }),
      })
    : createSchema.extend({
        confirmPassword: schemaPresets.password({
          strength: APP_CONFIG.AUTH.PASSWORD_STRENGTH,
        }),
      });

  return baseSchema.refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: '비밀번호가 일치하지 않습니다.',
      path: ['confirmPassword'],
    }
  );
};

const formDefaultValues = {
  id: '',
  name: '',
  password: '',
  confirmPassword: '',
  email: '',
};

function validatePrevValues(prevValues: ItemDTO | null) {
  if (!prevValues) return null;

  return {
    ...prevValues,
    password: '',
    confirmPassword: '',
  };
}

interface WriteFormProps {
  id?: string;
  prevValues: ItemDTO | null;
}

export function WriteForm({ id, prevValues }: WriteFormProps) {
  const sheet = useManageSheet();
  const pathname = usePathname();
  const formSchema = createFormSchema(!!id);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: (validatePrevValues(prevValues) ?? formDefaultValues) as z.infer<
      typeof formSchema
    >,
  });
  useFormGuard(form);

  useEffect(() => {
    form.reset((validatePrevValues(prevValues) ?? formDefaultValues) as z.infer<typeof formSchema>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValues]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const submitValues = values;

      // 데이터 DB 저장
      const { success, data, error } = id
        ? await updateItem({ id, values: submitValues, pathname })
        : await createItem({ values: submitValues, pathname });

      if (!success || !data) {
        toast.error(error);
        return;
      }

      toast.success(id ? SUCCESS_MESSAGES.UPDATE_SUCCESS() : SUCCESS_MESSAGES.CREATE_SUCCESS());
      sheet.close();
    } catch (error) {
      console.error(error);
      toast.error(GENERAL_ERRORS.UNEXPECTED);
    }
  }

  return (
    <SheetBody>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SheetContainer>
          <FieldGroup>
            <FormTextInput
              control={form.control}
              name="id"
              label="아이디"
              description={
                id
                  ? '아이디는 수정할 수 없습니다.'
                  : `아이디는 최소 ${APP_CONFIG.AUTH.ID_MIN_LENGTH}자 이상 입력해주세요.`
              }
              disabled={!!id}
            />

            <FormTextInput
              control={form.control}
              name="name"
              label="이름"
              placeholder="이름을 입력해주세요."
            />

            <FormEmailInput
              control={form.control}
              name="email"
              label="이메일"
              placeholder="이메일을 입력해주세요."
            />

            <div className="relative">
              <FieldGroup>
                <FormPasswordInput
                  control={form.control}
                  name="password"
                  label="비밀번호"
                  placeholder="비밀번호를 입력해주세요."
                  optional={!!id}
                  disabled={IS_DEMO && !!id}
                />

                <FormPasswordInput
                  control={form.control}
                  name="confirmPassword"
                  label="비밀번호 확인"
                  placeholder="비밀번호를 다시 입력해주세요."
                  optional={!!id}
                  disabled={IS_DEMO && !!id}
                />
              </FieldGroup>

              {IS_DEMO && id && (
                <DemoOverlay>
                  <DemoOverlayMessage>{DEMO_MESSAGES.PASSWORD_BLOCKED}</DemoOverlayMessage>
                </DemoOverlay>
              )}
            </div>
          </FieldGroup>
        </SheetContainer>

        <SheetFooter>
          <ManageSheetClose />
          <ManageFormSubmit isLoading={form.formState.isSubmitting} />
        </SheetFooter>
      </form>
    </SheetBody>
  );
}
