'use client';

import { ReactNode, ReactElement, useState } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from 'react-hook-form';
import {
  FieldSet,
  FieldLegend,
  FieldGroup,
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
} from './field';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Checkbox } from '@/shared/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Switch } from '@/shared/ui/switch';
import { Combobox } from '@/shared/ui/combobox';
import { MultiCombobox } from '@/shared/ui/multi-combobox';
import { DatePicker, type DatePickerBaseProps } from '@/shared/ui/date-picker';
import {
  type FormFileValue,
  type FileAcceptPreset,
  fileAcceptPresets,
  MultiFileUpload,
} from '@/shared/ui/file-upload';
import { mbToBytes, formatFileSize } from '@/shared/lib/utils/format';
import { type DateRange } from 'react-day-picker';
import { Editor } from '@/shared/ui/editor/editor';
import { NumericFormat } from 'react-number-format';

/**
 * react-hook-form의 field가 관리하는 props들을 명시적으로 제외
 * FormField 컴포넌트가 내부에서 관리하는 props들을 제외
 */
type ExcludedFormProps = 'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'id' | 'defaultValue';

/**
 * 모든 Form 컴포넌트의 공통 props
 */
type FormBaseProps<V extends FieldValues = FieldValues, N extends FieldPath<V> = FieldPath<V>> = {
  control: Control<V>;
  name: N;
  label: ReactNode;
  description?: ReactNode;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
};

/**
 * FormField Props - Render Props 패턴
 */
type FormFieldProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & {
  children: (
    field: ControllerRenderProps<V, N> & {
      id: string;
      fieldState: ControllerFieldState;
    }
  ) => ReactNode;
};

/**
 * FormField - 최대 유연성을 위한 Render Props 패턴
 *
 * @example
 * ```tsx
 * <FormField
 *   control={form.control}
 *   name="custom"
 *   label="커스텀 필드"
 *   description="커스텀 컴포넌트 사용 예시"
 * >
 *   {field => (
 *     <CustomComponent
 *       {...field}
 *       specialProp="value"
 *     />
 *   )}
 * </FormField>
 * ```
 */
export const FormField = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation = 'vertical',
  children,
}: FormFieldProps<V, N>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          orientation={orientation}
        >
          <FieldContent>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
          {children({
            ...field,
            id: field.name,
            fieldState,
          })}
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

type FormInputProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & Omit<React.InputHTMLAttributes<HTMLInputElement>, ExcludedFormProps>;

export const FormInput = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  ...inputProps
}: FormInputProps<V, N>): ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
    >
      {({ fieldState, ...field }) => (
        <Input
          {...field}
          aria-invalid={fieldState.invalid}
          {...inputProps}
        />
      )}
    </FormField>
  );
};

type FormTextareaProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, ExcludedFormProps>;

export const FormTextarea = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  ...textareaProps
}: FormTextareaProps<V, N>): ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
    >
      {({ fieldState, ...field }) => (
        <Textarea
          {...field}
          {...textareaProps}
          aria-invalid={fieldState.invalid}
        />
      )}
    </FormField>
  );
};

type FormSwitchProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = Omit<FormBaseProps<V, N>, 'description' | 'orientation'>;

export const FormSwitch = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
}: FormSwitchProps<V, N>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Field
            orientation='horizontal'
            data-invalid={fieldState.invalid}
          >
            <Switch
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          </Field>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

type FormCheckboxProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = Omit<FormBaseProps<V, N>, 'description' | 'orientation'>;

export const FormCheckbox = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
}: FormCheckboxProps<V, N>): ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Field
            orientation='horizontal'
            data-invalid={fieldState.invalid}
          >
            <Checkbox
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          </Field>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

type FormCheckboxGroupProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = Omit<FormBaseProps<V, N>, 'orientation'> & {
  options: {
    label: string;
    value: string | number;
  }[];
  vertical?: boolean;
};

export const FormCheckboxGroup = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  label,
  description,
  name,
  options,
  vertical = false,
}: FormCheckboxGroupProps<V, N>): ReactElement => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldSet data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLegend
              variant='label'
              className='mb-0'
            >
              {label}
            </FieldLegend>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
          <FieldGroup
            data-slot='checkbox-group'
            className={
              vertical
                ? ''
                : 'flex-wrap flex-row [&>[data-slot=field]]:w-auto data-[slot=checkbox-group]:gap-x-6 data-[slot=checkbox-group]:gap-y-3'
            }
          >
            {options.map((option, index) => (
              <Field
                key={index}
                orientation='horizontal'
                data-invalid={fieldState.invalid}
              >
                <Checkbox
                  id={`${field.name}-${index}`}
                  name={field.name}
                  aria-invalid={fieldState.invalid}
                  checked={field.value.includes(option.value)}
                  onCheckedChange={checked => {
                    const newValue = checked
                      ? [...field.value, option.value]
                      : field.value.filter((value: string | number) => value !== option.value);
                    field.onChange(newValue);
                  }}
                />
                <FieldLabel htmlFor={`${field.name}-${index}`}>{option.label}</FieldLabel>
              </Field>
            ))}
          </FieldGroup>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
};

type FormRadioGroupProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = Omit<FormBaseProps<V, N>, 'orientation'> & {
  options: {
    label: string;
    value: string;
  }[];
  vertical?: boolean;
};

export const FormRadioGroup = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  label,
  description,
  name,
  options,
  vertical = false,
}: FormRadioGroupProps<V, N>): ReactElement => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldSet data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLegend
              variant='label'
              className='mb-0'
            >
              {label}
            </FieldLegend>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            aria-invalid={fieldState.invalid}
            className={
              vertical ? '' : 'flex flex-wrap flex-row gap-x-6 gap-y-3 [&>[data-slot=field]]:w-auto'
            }
          >
            {options.map((option, index) => (
              <Field
                key={index}
                orientation='horizontal'
                data-invalid={fieldState.invalid}
              >
                <RadioGroupItem
                  id={`${field.name}-${index}`}
                  value={option.value}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel htmlFor={`${field.name}-${index}`}>{option.label}</FieldLabel>
              </Field>
            ))}
          </RadioGroup>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
};

type FormSelectProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & {
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
};

export const FormSelect = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  options,
  placeholder = 'Select',
}: FormSelectProps<V, N>): ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
    >
      {({ onChange, fieldState, ...field }) => (
        <Select
          name={field.name}
          value={field.value}
          onValueChange={onChange}
        >
          <SelectTrigger
            id={field.name}
            aria-invalid={fieldState.invalid}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
};

type FormComboboxProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & {
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
};

export const FormCombobox = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  className,
}: FormComboboxProps<V, N>): ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
    >
      {({ onChange, fieldState, ...field }) => (
        <Combobox
          value={field.value}
          onValueChange={onChange}
          options={options}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          className={className}
          aria-invalid={fieldState.invalid}
        />
      )}
    </FormField>
  );
};

type FormMultiComboboxProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & {
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
};

export const FormMultiCombobox = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  className,
}: FormMultiComboboxProps<V, N>): ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
    >
      {({ onChange, fieldState, ...field }) => (
        <MultiCombobox
          value={field.value}
          onValueChange={onChange}
          options={options}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          className={className}
          aria-invalid={fieldState.invalid}
        />
      )}
    </FormField>
  );
};

type FormDatePickerBaseProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & Omit<DatePickerBaseProps, 'aria-invalid' | 'className'>;

type FormSingleDatePickerProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormDatePickerBaseProps<V, N> & {
  mode?: 'single';
  presets?: boolean | { label: string; date: Date }[];
};

type FormMultipleDatePickerProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormDatePickerBaseProps<V, N> & {
  mode: 'multiple';
  min?: number;
  max?: number;
};

type FormRangeDatePickerProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormDatePickerBaseProps<V, N> & {
  mode: 'range';
  numberOfMonths?: number;
  min?: number;
  max?: number;
};

type FormDatePickerProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> =
  | FormSingleDatePickerProps<V, N>
  | FormMultipleDatePickerProps<V, N>
  | FormRangeDatePickerProps<V, N>;

export const FormDatePicker = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>(
  props: FormDatePickerProps<V, N>
): ReactElement => {
  const {
    control,
    name,
    label,
    description,
    orientation,
    placeholder,
    disabled,
    fromDate,
    toDate,
    captionLayout,
    showOutsideDays,
  } = props;

  const mode = props.mode ?? 'single';

  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
    >
      {({ onChange, fieldState, ...field }) => {
        if (mode === 'single') {
          const { presets } = props as FormSingleDatePickerProps<V, N>;

          return (
            <DatePicker
              mode='single'
              value={field.value as Date | undefined}
              onValueChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              fromDate={fromDate}
              toDate={toDate}
              captionLayout={captionLayout}
              showOutsideDays={showOutsideDays}
              presets={presets}
              aria-invalid={fieldState.invalid}
            />
          );
        }

        if (mode === 'multiple') {
          const { min, max } = props as FormMultipleDatePickerProps<V, N>;
          return (
            <DatePicker
              mode='multiple'
              value={field.value as Date[] | undefined}
              onValueChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              fromDate={fromDate}
              toDate={toDate}
              captionLayout={captionLayout}
              showOutsideDays={showOutsideDays}
              min={min}
              max={max}
              aria-invalid={fieldState.invalid}
            />
          );
        }

        if (mode === 'range') {
          const { numberOfMonths, min, max } = props as FormRangeDatePickerProps<V, N>;
          return (
            <DatePicker
              mode='range'
              value={field.value as DateRange | undefined}
              onValueChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              fromDate={fromDate}
              toDate={toDate}
              captionLayout={captionLayout}
              showOutsideDays={showOutsideDays}
              numberOfMonths={numberOfMonths}
              min={min}
              max={max}
              aria-invalid={fieldState.invalid}
            />
          );
        }

        return null;
      }}
    </FormField>
  );
};

type FormFileUploadProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = Omit<FormBaseProps<V, N>, 'orientation'> & {
  max?: number;
  accept?: string;
  acceptPreset?: FileAcceptPreset;
  /** 최대 파일 크기 (MB 단위) */
  maxSize?: number;
  placeholder?: string;
  hideConstraints?: boolean;
};

const generateFileConstraintsText = (
  accept?: string,
  maxSize?: number,
  max?: number
): string | null => {
  const parts: string[] = [];

  if (accept) {
    const extensions = accept
      .split(',')
      .map(t => t.trim())
      .map(t => {
        if (t.startsWith('.')) {
          return t.slice(1);
        } else if (t.endsWith('/*')) {
          const baseType = t.slice(0, -2);
          if (baseType === 'image') return '이미지';
          if (baseType === 'video') return '비디오';
          if (baseType === 'audio') return '오디오';
          return baseType;
        }
        return t;
      });

    // 확장자가 5개 초과시 앞 4개 + "등"으로 표기
    if (extensions.length > 5) {
      parts.push(extensions.slice(0, 4).join(', ') + ' 등');
    } else {
      parts.push(extensions.join(', '));
    }
  }

  if (maxSize) {
    parts.push(`최대 ${formatFileSize(maxSize)}`);
  }

  if (max) {
    parts.push(`최대 ${max}개`);
  }

  return parts.length > 0 ? parts.join(' / ') : null;
};

export const FormFileUpload = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  max = 1,
  accept,
  acceptPreset,
  maxSize,
  placeholder,
  hideConstraints = false,
}: FormFileUploadProps<V, N>): ReactElement => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const resolvedAccept = acceptPreset ? fileAcceptPresets[acceptPreset] : accept;
  const resolvedMaxSizeBytes = maxSize ? mbToBytes(maxSize) : undefined;
  const constraintsText = !hideConstraints
    ? generateFileConstraintsText(resolvedAccept, resolvedMaxSizeBytes, max)
    : null;
  const displayDescription = description || constraintsText;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldSet
          data-invalid={fieldState.invalid || !!validationError}
          className='gap-2'
        >
          <FieldContent>
            {label && (
              <FieldLegend
                variant='label'
                className='mb-0'
              >
                {label}
              </FieldLegend>
            )}
            {displayDescription && <FieldDescription>{displayDescription}</FieldDescription>}
          </FieldContent>
          <MultiFileUpload
            value={field.value as FormFileValue[]}
            onValueChange={field.onChange}
            onError={setValidationError}
            accept={accept}
            acceptPreset={acceptPreset}
            maxSize={maxSize}
            max={max}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid || !!validationError}
          />
          {(fieldState.error || validationError) && (
            <FieldError>{validationError || fieldState.error?.message}</FieldError>
          )}
        </FieldSet>
      )}
    />
  );
};

type FormEditorProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & {
  placeholder?: string;
  className?: string;
  /** 업로드 폴더 경로 (우선순위 1: 명시적 경로) */
  uploadFolder?: string;
  /** 엔티티명 (우선순위 2: 자동 경로 생성용, 예: 'notices') */
  entity?: string;
  /** 최대 이미지 크기 (MB 단위, 기본값: 2) */
  maxImageSizeMB?: number;
  /** 허용되는 이미지 형식 (기본값: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) */
  acceptedImageFormats?: string[];
};

export const FormEditor = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  placeholder = '내용을 입력하세요...',
  className,
  uploadFolder,
  entity,
  maxImageSizeMB,
  acceptedImageFormats,
}: FormEditorProps<V, N>): ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
    >
      {({ onChange, fieldState, ...field }) => (
        <Editor
          content={field.value as string}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
          uploadFolder={uploadFolder}
          entity={entity}
          maxImageSizeMB={maxImageSizeMB}
          acceptedImageFormats={acceptedImageFormats}
        />
      )}
    </FormField>
  );
};

type FormNumberInputProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> & {
  /** 최소값 */
  min?: number;
  /** 최대값 */
  max?: number;
  /** 천 단위 구분자 (기본: false) */
  thousandSeparator?: boolean | string;
  /** 접두사 (예: '₩', '$') */
  prefix?: string;
  /** 접미사 (예: '원', '개') */
  suffix?: string;
  /** 소수점 허용 여부 (기본: false) */
  allowDecimal?: boolean;
  /** 소수점 자릿수 (allowDecimal=true일 때만) */
  decimalScale?: number;
  /** 음수 허용 여부 (기본: false) */
  allowNegative?: boolean;
  /** placeholder */
  placeholder?: string;
};

/**
 * FormNumberInput - 숫자 입력 전용 컴포넌트 (react-number-format 기반)
 *
 * @example
 * ```tsx
 * // 기본 숫자 입력
 * <FormNumberInput
 *   control={form.control}
 *   name="age"
 *   label="나이"
 *   min={0}
 *   max={120}
 * />
 *
 * // 천 단위 구분자
 * <FormNumberInput
 *   control={form.control}
 *   name="viewCount"
 *   label="조회수"
 *   thousandSeparator
 * />
 *
 * // 통화
 * <FormNumberInput
 *   control={form.control}
 *   name="price"
 *   label="가격"
 *   prefix="₩"
 *   thousandSeparator
 * />
 *
 * // 소수점
 * <FormNumberInput
 *   control={form.control}
 *   name="rating"
 *   label="평점"
 *   min={0}
 *   max={5}
 *   allowDecimal
 *   decimalScale={1}
 * />
 * ```
 */
export const FormNumberInput = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>({
  control,
  name,
  label,
  description,
  orientation,
  min,
  max,
  thousandSeparator = false,
  prefix,
  suffix,
  allowDecimal = false,
  decimalScale,
  allowNegative = false,
  placeholder,
}: FormNumberInputProps<V, N>): ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
    >
      {({ onChange, fieldState, ...field }) => (
        <NumericFormat
          customInput={Input}
          value={field.value}
          onValueChange={values => {
            onChange(values.floatValue ?? 0);
          }}
          thousandSeparator={thousandSeparator}
          prefix={prefix}
          suffix={suffix}
          allowNegative={allowNegative}
          decimalScale={allowDecimal ? decimalScale : 0}
          fixedDecimalScale={allowDecimal && decimalScale !== undefined}
          placeholder={placeholder}
          isAllowed={values => {
            const { floatValue } = values;
            if (floatValue === undefined) return true;
            if (min !== undefined && floatValue < min) return false;
            if (max !== undefined && floatValue > max) return false;
            return true;
          }}
          aria-invalid={fieldState.invalid}
        />
      )}
    </FormField>
  );
};
