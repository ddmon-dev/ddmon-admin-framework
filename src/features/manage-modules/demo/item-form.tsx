'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { FieldGroup } from '@/shared/ui/field';
import {
  FormInput,
  FormTextarea,
  FormNumberInput,
  FormPhoneInput,
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
import { LoadingButton } from '@/shared/ui/loading-button';
import { schemaPresets } from '@/shared/schemas/presets';
import { type FormFilesField } from '@/shared/lib/file-system';
import { handleFileUploads } from '../_base/utils';

import { CONFIG } from './config';
import { type ItemDTO } from './types';
import { createItem } from './actions/create-item';
import { updateItem } from './actions/update-item';

const formSchema = z.object({
  // FormInput
  name: z.string().min(1, '이름을 입력해주세요.'),
  email: z.string().email('올바른 이메일을 입력해주세요.').optional().or(z.literal('')),

  // FormTextarea
  description: z.string().optional(),

  // FormNumberInput
  age: z.number().int().min(0).max(150).optional(),
  price: z.number().min(0).optional(),

  // FormPhoneInput
  phone: z
    .string()
    .regex(/^0[0-9]{9,10}$/, '올바른 전화번호를 입력해주세요.')
    .optional()
    .or(z.literal('')),

  // FormSwitch
  newsletterSubscribed: z.boolean(),

  // FormCheckbox
  termsAccepted: z.boolean(),

  // FormCheckboxGroup
  interests: z.array(z.string()).optional(),

  // FormRadioGroup
  gender: z.string().optional(),

  // FormSelect
  country: z.string().optional(),

  // FormCombobox
  city: z.string().optional(),

  // FormMultiCombobox
  languages: z.array(z.string()).optional(),

  // FormDatePicker
  birthDate: z.date().optional(),

  // FormEditor
  bio: z.string().optional(),

  // FormFileUpload
  files: schemaPresets.files({ avatar: 0, attachments: 0 }),

  // FormFieldArray
  socialLinks: z
    .array(
      z.object({
        value: z.string().url('올바른 URL을 입력해주세요.').or(z.literal('')),
      })
    )
    .refine(links => links.some(link => link.value.trim() !== ''), {
      message: '최소 1개의 소셜 미디어 링크를 입력해주세요.',
    }),
});

const formDefaultValues = {
  name: '',
  email: '',
  description: '',
  age: undefined,
  price: undefined,
  phone: '',
  newsletterSubscribed: false,
  termsAccepted: false,
  interests: [],
  gender: '',
  country: '',
  city: '',
  languages: [],
  birthDate: undefined,
  bio: '',
  files: undefined,
  socialLinks: [{ value: '' }],
};

interface ItemFormProps {
  id?: string;
  prevValues: ItemDTO | null;
}

export function ItemForm({ id, prevValues }: ItemFormProps) {
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
    console.log(values);
    try {
      const { files: formFiles, ...restValues } = values;

      // 데이터 DB 저장
      const { success, data, error } = id
        ? await updateItem({ id, values: restValues, path: pathname })
        : await createItem({ values: restValues, path: pathname });

      if (!success || !data) {
        throw new Error(error || '저장에 실패했습니다.');
      }

      // 파일 업로드
      await handleFileUploads({
        formFiles: formFiles as FormFilesField,
        itemId: data.id,
        tableName: CONFIG.tableName,
        pathname,
        updateItemAction: updateItem,
      });

      alert('저장되었습니다.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '저장에 실패했습니다.');
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-6'
    >
      {/* 기본 정보 */}
      <FieldGroup>
        <h3 className='text-lg font-semibold'>기본 정보</h3>

        <FormInput
          control={form.control}
          name='name'
          label='이름'
          placeholder='홍길동'
        />

        <FormInput
          control={form.control}
          name='email'
          label='이메일'
          type='email'
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
          min={0}
          max={150}
          optional
        />

        <FormNumberInput
          control={form.control}
          name='price'
          label='가격'
          prefix='₩'
          thousandSeparator
          min={0}
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
          optional
        />

        <FormCheckboxGroup
          control={form.control}
          name='interests'
          label='관심사 (Checkbox Group)'
          options={[...CONFIG.interestOptions]}
          optional
        />

        <FormSelect
          control={form.control}
          name='country'
          label='국가 (Select)'
          options={[...CONFIG.countryOptions]}
          placeholder='국가를 선택하세요'
          optional
        />

        <FormCombobox
          control={form.control}
          name='city'
          label='도시 (Combobox)'
          options={[...CONFIG.cityOptions]}
          placeholder='도시를 검색하세요'
          optional
        />

        <FormMultiCombobox
          control={form.control}
          name='languages'
          label='언어 (Multi Combobox)'
          options={[...CONFIG.languageOptions]}
          placeholder='언어를 선택하세요'
          optional
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
          optional
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
            <FormInput
              control={control}
              name={`socialLinks.${index}.value`}
              label=''
              placeholder='https://twitter.com/username'
              inputMode='url'
            />
          )}
        </FormFieldArray>
      </FieldGroup>

      {/* 제출 버튼 */}
      <div className='flex justify-end gap-2 pt-4'>
        <LoadingButton
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          {id ? '수정' : '생성'}
        </LoadingButton>
      </div>
    </form>
  );
}
