'use client';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldGroup } from '@/shared/ui/field';
import {
  FormInput,
  FormTextarea,
  FormCheckbox,
  FormCheckboxGroup,
  FormRadioGroup,
  FormSelect,
  FormCombobox,
  FormMultiCombobox,
} from '@/shared/ui/form-fields';
import { LoadingButton } from '@/shared/ui/loading-button';

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  textarea: z.string().min(1),
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
});

const formDefaultValues = {
  name: '',
  email: '',
  password: '',
  textarea: '',
  checkbox: false,
  checkboxGroup: [],
  checkboxGroupVertical: [],
  radioGroup: 'option1',
  radioGroupVertical: 'option2',
  select: '',
  combobox: '',
  multiCombobox: [],
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
