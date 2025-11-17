'use client';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldGroup } from '@/shared/ui/field';
import {
  FormInput,
  FormTextarea,
  FormSwitch,
  FormCheckbox,
  FormCheckboxGroup,
  FormRadioGroup,
  FormSelect,
  FormCombobox,
  FormMultiCombobox,
  FormDatePicker,
  FormFileUpload,
} from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';
import { schemaPresets } from '@/shared/schemas/presets';

const formSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z
    .string()
    .min(6, '비밀번호는 6자 이상이어야 합니다')
    .max(16, '비밀번호는 16자 이하이어야 합니다')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
      message: '비밀번호는 6자 이상, 16자 이하의 영문, 숫자, 특수문자를 포함해야 합니다.',
    }),
  textarea: z.string().min(1, '내용을 입력하세요'),
  switch: z.boolean(),
  checkbox: z.boolean().refine(val => val === true, { message: '동의해주세요' }),
  checkboxGroup: z.array(z.string()).min(1, '최소 1개를 선택해주세요'),
  checkboxGroupVertical: z.array(z.string()).min(1, '최소 1개를 선택해주세요'),
  radioGroup: z.string().min(1, '선택해주세요'),
  radioGroupUnselected: z.string().min(1, '선택해주세요'),
  radioGroupVertical: z.string().min(1, '선택해주세요'),
  select: z.string().min(1, '선택해주세요'),
  combobox: z.string().min(1, '선택해주세요'),
  multiCombobox: z.array(z.string()).min(1, '최소 1개를 선택해주세요'),
  dateSingle: z.date({ message: '날짜를 선택해주세요' }),
  dateMultiple: z.array(z.date()).min(1, '최소 1개의 날짜를 선택해주세요'),
  dateRange: schemaPresets.dateRange,
  fileUpload: schemaPresets.fileUpload(1),
  imageUpload: schemaPresets.fileUpload(1),
  multiFileUpload: schemaPresets.fileUpload(1),
});

const formDefaultValues: z.infer<typeof formSchema> = {
  name: 'name',
  email: 'email@example.com',
  password: 'password',
  textarea: 'textarea',
  switch: true,
  checkbox: true,
  checkboxGroup: ['option1', 'option2', 'option3'],
  checkboxGroupVertical: ['option1', 'option2', 'option3'],
  radioGroup: 'option1',
  radioGroupUnselected: 'option1',
  radioGroupVertical: 'option2',
  select: 'option1',
  combobox: 'option1',
  multiCombobox: ['option1', 'option2', 'option3'],
  dateSingle: new Date(),
  dateMultiple: [new Date(), new Date(), new Date()],
  dateRange: { from: new Date(), to: new Date() },
  fileUpload: [],
  imageUpload: [
    {
      type: 'existing',
      url: 'https://picsum.photos/200',
      name: 'existing-image.jpg',
    },
  ],
  multiFileUpload: [
    {
      type: 'existing',
      url: 'https://example.com/report.pdf',
      name: 'annual-report-2024.pdf',
    },
    {
      type: 'existing',
      url: 'https://example.com/contract.docx',
      name: 'contract-agreement-final-version.docx',
    },
  ],
};

export function DemoForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
    mode: 'onChange',
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  console.log(form.formState.errors);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name='name'
          label='Name'
          description='Enter your name'
        />
        <FormInput
          control={form.control}
          name='email'
          label='Email'
          type='email'
        />
        <FormInput
          control={form.control}
          name='password'
          label='Password'
          type='password'
        />
        <FormTextarea
          control={form.control}
          name='textarea'
          label='Textarea'
        />
        <FormSwitch
          control={form.control}
          name='switch'
          label='Switch'
        />
        <FormCheckbox
          control={form.control}
          name='checkbox'
          label='Agree to terms'
        />
        <FormCheckboxGroup
          control={form.control}
          name='checkboxGroup'
          label='Checkbox Group'
          description='Select all that apply'
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
            { label: 'Option 4', value: 'option4' },
            { label: 'Option 5', value: 'option5' },
            { label: 'Option 6', value: 'option6' },
          ]}
        />
        <FormCheckboxGroup
          control={form.control}
          name='checkboxGroupVertical'
          label='Checkbox Group Vertical'
          vertical
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
        />
        <FormRadioGroup
          control={form.control}
          name='radioGroup'
          label='Radio Group'
          description='Select an option'
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
            { label: 'Option 4', value: 'option4' },
            { label: 'Option 5', value: 'option5' },
            { label: 'Option 6', value: 'option6' },
          ]}
        />
        <FormRadioGroup
          control={form.control}
          name='radioGroupUnselected'
          label='Radio Group Unselected'
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
            { label: 'Option 4', value: 'option4' },
            { label: 'Option 5', value: 'option5' },
            { label: 'Option 6', value: 'option6' },
          ]}
        />
        <FormRadioGroup
          control={form.control}
          name='radioGroupVertical'
          label='Radio Group Vertical'
          vertical
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
        />
        <FormSelect
          control={form.control}
          name='select'
          label='Select'
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
        />
        <FormCombobox
          control={form.control}
          name='combobox'
          label='Combobox'
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
        />
        <FormMultiCombobox
          control={form.control}
          name='multiCombobox'
          label='Multi Combobox'
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
        />
        <FormDatePicker
          control={form.control}
          name='dateSingle'
          label='Date (Single)'
          description='날짜를 선택하세요'
          presets
        />
        <FormDatePicker
          control={form.control}
          name='dateMultiple'
          label='Date (Multiple)'
          description='여러 날짜를 선택하세요'
          mode='multiple'
          max={5}
        />
        <FormDatePicker
          control={form.control}
          name='dateRange'
          label='Date (Range)'
          description='기간을 선택하세요'
          mode='range'
          numberOfMonths={2}
        />
        <FormFileUpload
          control={form.control}
          name='fileUpload'
          label='File Upload'
          acceptPreset='documents'
          maxSize={1}
        />
        <FormFileUpload
          control={form.control}
          name='imageUpload'
          label='Image Upload (기존 파일 있음)'
          acceptPreset='images'
          maxSize={5}
        />
        <FormFileUpload
          control={form.control}
          name='multiFileUpload'
          label='첨부 파일 (복수)'
          max={5}
          acceptPreset='documents'
          maxSize={10}
        />
        <LoadingButton
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          Submit
        </LoadingButton>
      </FieldGroup>
    </form>
  );
}
