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
import { type FileUploadValue } from '@/shared/ui/file-upload';
import { LoadingButton } from '@/shared/ui/loading-button';

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  textarea: z.string().min(1),
  switch: z.boolean().refine(val => val === true, {
    message: 'Switch must be checked',
  }),
  checkbox: z.boolean().refine(val => val === true, {
    message: 'Checkbox must be checked',
  }),
  checkboxGroup: z.array(z.string()).min(1),
  checkboxGroupVertical: z.array(z.string()).min(1),
  radioGroup: z.string().min(1),
  radioGroupUnselected: z.string().min(1),
  radioGroupVertical: z.string().min(1),
  select: z.string().min(1),
  combobox: z.string().min(1),
  multiCombobox: z.array(z.string()).min(1),
  dateSingle: z.date({ message: '날짜를 선택해주세요.' }),
  dateMultiple: z.array(z.date()).min(1, '최소 1개 이상 선택해주세요.'),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .refine(data => data.from, { message: '기간을 선택해주세요.' }),
  fileUpload: z.custom<FileUploadValue>(
    val => {
      if (val === null || val === undefined) return false;
      const file = val as FileUploadValue;
      if (file && file.type === 'existing' && file.markedForDeletion) return false;
      return true;
    },
    { message: '파일을 업로드해주세요.' }
  ),
  imageUpload: z.custom<FileUploadValue>(
    val => {
      if (val === null || val === undefined) return false;
      const file = val as FileUploadValue;
      if (file && file.type === 'existing' && file.markedForDeletion) return false;
      return true;
    },
    { message: '이미지를 업로드해주세요.' }
  ),
});

const formDefaultValues: z.infer<typeof formSchema> = {
  name: '',
  email: '',
  password: '',
  textarea: '',
  switch: false,
  checkbox: false,
  checkboxGroup: [],
  checkboxGroupVertical: [],
  radioGroup: 'option1',
  radioGroupUnselected: '',
  radioGroupVertical: 'option2',
  select: '',
  combobox: '',
  multiCombobox: [],
  dateSingle: undefined as unknown as Date,
  dateMultiple: [],
  dateRange: { from: undefined as unknown as Date, to: undefined },
  fileUpload: null,
  imageUpload: {
    type: 'existing',
    url: 'https://picsum.photos/200',
    name: 'existing-image.jpg',
  },
};

function DemoForm() {
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
        />
        <FormInput
          control={form.control}
          name='password'
          label='Password'
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
          legend='Checkbox Group'
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
          legend='Checkbox Group Vertical'
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
          legend='Radio Group'
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
          legend='Radio Group Unselected'
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
          legend='Radio Group Vertical'
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
          description='PDF 또는 문서 파일을 업로드하세요'
          accept='.pdf,.doc,.docx'
          maxSize={10 * 1024 * 1024}
        />
        <FormFileUpload
          control={form.control}
          name='imageUpload'
          label='Image Upload (기존 파일 있음)'
          description='이미지 파일만 업로드 가능합니다 (최대 5MB)'
          accept='image/*'
          maxSize={5 * 1024 * 1024}
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

export default function DemoPage() {
  return (
    <div className='flex flex-col w-full max-w-md mx-auto pt-20 pb-40 gap-y-10'>
      <DemoForm />
    </div>
  );
}
