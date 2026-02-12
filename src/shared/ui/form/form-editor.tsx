'use client';

import { ReactElement } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { Editor, type EditorProps } from '@/shared/ui/editor/editor';
import { FormField } from './form-field';
import type { FormBaseProps } from './types';

type ExcludedEditorProps = 'content' | 'onChange' | 'ref';

export type FormEditorProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & Omit<TiptapEditorProps, ExcludedEditorProps>;

export const FormEditor = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  optional,
  ...editorProps
}: FormEditorProps<V, N>): ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
      optional={optional}
    >
      {({ onChange, ...field }) => (
        <Editor
          ref={field.ref}
          content={field.value as string}
          onChange={onChange}
          {...editorProps}
        />
      )}
    </FormField>
  );
};
