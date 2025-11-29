'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FieldGroup } from '@/shared/ui/field';
import {
  FormTextInput,
  FormEmailInput,
  FormTextarea,
  FormNumberInput,
  FormPhoneInput,
  FormAddressInput,
  FormSwitch,
  FormCheckbox,
  FormCheckboxGroup,
  FormRadioGroup,
  FormSelect,
  FormCombobox,
  FormMultiCombobox,
  FormDatePicker,
  FormEditor,
  FormFileUpload,
  FormFieldArray,
} from '@/shared/ui/form-fields';
import { Button } from '@/shared/ui/button';
import { schemaPresets } from '@/shared/schemas';
import { type FormFilesField, uploadFormFiles } from '@/shared/lib/file-system';

import { useManageSheet, ManageSheetFooter, ManageFormSubmit, ManageSheetClose } from '../_base/ui';
import { CONFIG } from './config';
import { type ItemDTO } from './config';
import { createItem, updateItem } from './actions';

import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { GENERAL_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';

const formSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  email: schemaPresets.email({ optional: true }),
  phone: schemaPresets.phone({ optional: true }),
  zipCode: z.string(),
  address: z.string(),
  addressDetail: z.string(),
  description: z.string().nullish(),
  age: z.number().min(0).max(150, '나이는 0~150 사이의 숫자를 입력해주세요.').int().nullish(),
  price: z.number().min(0).int().nullish(),
  gender: z.string().min(0),
  interests: z.array(z.string()).min(0),
  country: z.string().min(0),
  city: z.string().min(0),
  languages: z.array(z.string()).min(0),
  newsletterSubscribed: z.boolean(),
  termsAccepted: z.boolean(),
  birthDate: z.date().nullish(),
  bio: z.string().nullish(),
  files: schemaPresets.files({ avatar: 0, attachments: 0 }),
  socialLinks: z.array(
    z.object({
      value: schemaPresets.url({ optional: true }),
    })
  ),
});

const formDefaultValues = {
  name: '',
  email: '',
  description: '',
  age: undefined,
  price: undefined,
  phone: '',
  zipCode: '',
  address: '',
  addressDetail: '',
  newsletterSubscribed: false,
  termsAccepted: false,
  interests: [],
  gender: '',
  country: '',
  city: '',
  languages: [],
  birthDate: null,
  bio: '',
  files: undefined,
  socialLinks: [{ value: '' }],
};

interface WriteFormProps {
  id?: string;
  prevValues: ItemDTO | null;
}

export function WriteForm({ id, prevValues }: WriteFormProps) {
  const sheet = useManageSheet();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: (prevValues ?? formDefaultValues) as z.infer<typeof formSchema>,
  });

  useEffect(() => {
    form.reset((prevValues ?? formDefaultValues) as z.infer<typeof formSchema>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValues]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { files: formFiles, ...submitValues } = values;

      // 데이터 DB 저장
      const { success, data, error } = id
        ? await updateItem({ id, values: submitValues as Partial<ItemDTO>, pathname })
        : await createItem({ values: submitValues as Partial<ItemDTO>, pathname });

      if (!success || !data) {
        toast.error(id ? CRUD_ERRORS.UPDATE_FAILED() : CRUD_ERRORS.CREATE_FAILED(), {
          description: error,
        });
        return;
      }

      // 파일 업로드
      await uploadFormFiles({
        formFiles: formFiles as FormFilesField,
        id: data.id,
        tableName: CONFIG.tableName,
        pathname,
        updateAction: updateItem,
      });

      toast.success(id ? SUCCESS_MESSAGES.UPDATE_SUCCESS() : SUCCESS_MESSAGES.CREATE_SUCCESS());
      sheet.close();
    } catch (error) {
      console.error(error);
      toast.error(GENERAL_ERRORS.UNEXPECTED, {
        description: GENERAL_ERRORS.PLEASE_TRY_AGAIN,
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* 기본 정보 */}
      <FieldGroup>
        <h3 className='text-lg font-semibold'>기본 정보</h3>

        <FormTextInput
          control={form.control}
          name='name'
          label='이름'
          placeholder='홍길동'
        />

        <FormEmailInput
          control={form.control}
          name='email'
          label='이메일'
          placeholder='example@example.com'
          optional
        />

        <FormPhoneInput
          control={form.control}
          name='phone'
          label='전화번호'
          placeholder='010-1234-5678'
          optional
        />

        <FormAddressInput
          control={form.control}
          label='주소'
          optional
        />

        <FormTextarea
          control={form.control}
          name='description'
          label='자기소개 (Textarea)'
          placeholder='간단한 자기소개를 입력해주세요.'
          optional
        />
      </FieldGroup>

      {/* 숫자 입력 */}
      <FieldGroup>
        <h3 className='text-lg font-semibold'>숫자 입력</h3>

        <FormNumberInput
          control={form.control}
          name='age'
          label='나이'
          optional
        />

        <FormNumberInput
          control={form.control}
          name='price'
          label='가격'
          prefix='₩'
          thousandSeparator
          optional
        />
      </FieldGroup>

      {/* 선택 항목 */}
      <FieldGroup>
        <h3 className='text-lg font-semibold'>선택 항목</h3>

        <FormRadioGroup
          control={form.control}
          name='gender'
          label='성별 (Radio)'
          options={[...CONFIG.genderOptions]}
        />

        <FormCheckboxGroup
          control={form.control}
          name='interests'
          label='관심사 (Checkbox Group)'
          options={[...CONFIG.interestOptions]}
        />

        <FormSelect
          control={form.control}
          name='country'
          label='국가 (Select)'
          options={[...CONFIG.countryOptions]}
          placeholder='국가를 선택하세요'
        />

        <FormCombobox
          control={form.control}
          name='city'
          label='도시 (Combobox)'
          options={[...CONFIG.cityOptions]}
          placeholder='도시를 검색하세요'
        />

        <FormMultiCombobox
          control={form.control}
          name='languages'
          label='언어 (Multi Combobox)'
          options={[...CONFIG.languageOptions]}
          placeholder='언어를 선택하세요'
        />
      </FieldGroup>

      {/* 토글 */}
      <FieldGroup>
        <h3 className='text-lg font-semibold'>토글</h3>

        <FormSwitch
          control={form.control}
          name='newsletterSubscribed'
          label='뉴스레터 구독 (Switch)'
          // description='이메일로 뉴스레터를 받으시겠습니까?'
        />

        <FormCheckbox
          control={form.control}
          name='termsAccepted'
          label='이용약관 동의 (Checkbox)'
          // description='서비스 이용약관에 동의합니다.'
        />
      </FieldGroup>

      {/* 날짜 */}
      <FieldGroup>
        <h3 className='text-lg font-semibold'>날짜</h3>

        <FormDatePicker
          control={form.control}
          name='birthDate'
          label='생년월일 (Date Picker)'
          optional
        />
      </FieldGroup>

      {/* 에디터 */}
      <FieldGroup>
        <h3 className='text-lg font-semibold'>에디터</h3>

        <FormEditor
          control={form.control}
          name='bio'
          label='상세 자기소개 (Editor)'
          entity={CONFIG.tableName}
        />
      </FieldGroup>

      {/* 파일 업로드 */}
      <FieldGroup>
        <h3 className='text-lg font-semibold'>파일 업로드</h3>

        <FormFileUpload
          control={form.control}
          name='files.avatar'
          label='프로필 사진 (File Upload)'
          acceptPreset='images'
          maxSize={5}
          max={1}
          optional
        />

        <FormFileUpload
          control={form.control}
          name='files.attachments'
          label='첨부 파일 (File Upload)'
          acceptPreset='documents'
          maxSize={10}
          max={5}
          optional
        />
      </FieldGroup>

      {/* 동적 필드 배열 */}
      <FieldGroup>
        <h3 className='text-lg font-semibold'>동적 필드 배열</h3>

        <FormFieldArray
          control={form.control}
          name='socialLinks'
          label='소셜 미디어 링크 (Field Array)'
          description='SNS 링크를 추가하고 순서를 변경할 수 있습니다.'
          max={5}
          addButtonText='링크 추가'
          defaultValue={{ value: '' }}
        >
          {({ index, control }) => (
            <FormTextInput
              control={control}
              name={`socialLinks.${index}.value`}
              placeholder='https://twitter.com/username'
              inputMode='url'
            />
          )}
        </FormFieldArray>
      </FieldGroup>

      {/* 제출 버튼 */}
      <ManageSheetFooter>
        <ManageSheetClose />
        <ManageFormSubmit isLoading={form.formState.isSubmitting} />
      </ManageSheetFooter>
    </form>
  );
}
