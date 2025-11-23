'use client';

import { ReactElement, useRef } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/shared/ui/input-group';
import { Input } from '@/shared/ui/input';
import { FieldGroup } from '@/shared/ui/field';
import { FormField } from './form-field';
import type { FormBaseProps, ExcludedFormProps } from './types';
import type { DaumAddressData } from '@/shared/types/daum-postcode';

export type FormAddressInputProps<
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
> = FormBaseProps<V, N> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, ExcludedFormProps> & {
    /** 커스텀 주소 검색 API 함수 (Kakao 대신 사용) */
    onCustomSearch?: () => Promise<{ zipCode: string; address: string }>;
  };

/**
 * FormAddressInput - 주소 입력 컴포넌트
 *
 * Kakao 주소 API 기반 구현:
 * - 우편번호 + 주소찾기 버튼 (InputGroup)
 * - 주소 (readOnly)
 * - 상세주소 (직접 입력)
 *
 * @example
 * ```tsx
 * // 기본 사용 (모두 필수)
 * <FormAddressInput
 *   control={form.control}
 *   name="address"
 *   label="주소"
 * />
 *
 * // 상세주소 선택
 * <FormAddressInput
 *   control={form.control}
 *   name="shippingAddress"
 *   label="배송지 주소"
 * />
 *
 * // 커스텀 API 사용
 * <FormAddressInput
 *   control={form.control}
 *   name="address"
 *   onCustomSearch={async () => {
 *     const result = await myCustomApi();
 *     return { zipCode: result.zip, address: result.addr };
 *   }}
 * />
 * ```
 */
export const FormAddressInput = <
  V extends FieldValues = FieldValues,
  N extends FieldPath<V> = FieldPath<V>
>(
  props: FormAddressInputProps<V, N>
): ReactElement => {
  const {
    control,
    name,
    label,
    description,
    orientation,
    optional,
    onCustomSearch,
    ...inputProps
  } = props;
  const addressDetailRef = useRef<HTMLInputElement>(null);

  // Kakao 주소 API 팝업
  const openDaumPostcode = useDaumPostcodePopup();

  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
      optional={optional}
    >
      {({ fieldState, ...field }) => {
        const value = field.value || { zipCode: '', address: '', addressDetail: '' };

        const handleComplete = (data: DaumAddressData) => {
          const selectedAddress =
            data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

          field.onChange({
            zipCode: data.zonecode,
            address: selectedAddress,
            addressDetail: '',
          });

          // 상세주소 입력창 포커스
          setTimeout(() => {
            addressDetailRef.current?.focus();
          }, 100);
        };

        const handleSearch = async () => {
          if (onCustomSearch) {
            const result = await onCustomSearch();
            field.onChange({
              zipCode: result.zipCode,
              address: result.address,
              addressDetail: '',
            });
            setTimeout(() => {
              addressDetailRef.current?.focus();
            }, 100);
          } else {
            openDaumPostcode({ onComplete: handleComplete as any });
          }
        };

        const hasError = fieldState.invalid;

        return (
          <FieldGroup className='gap-y-2'>
            {/* 주소찾기 버튼 + 우편번호 + 주소 */}
            <div className='flex gap-2 flex-col sm:flex-row'>
              <InputGroup className='w-auto shrink-0'>
                <InputGroupAddon
                  align='inline-start'
                  className='-ml-2!'
                >
                  <InputGroupButton
                    size='xs'
                    onClick={handleSearch}
                    type='button'
                  >
                    <MapPin className='h-4 w-4' />
                    주소찾기
                  </InputGroupButton>
                </InputGroupAddon>
                <InputGroupInput
                  {...inputProps}
                  value={value.zipCode}
                  placeholder='우편번호'
                  readOnly
                  aria-invalid={hasError}
                  className='w-20 pl-3!'
                />
              </InputGroup>
              <Input
                value={value.address}
                placeholder='주소'
                readOnly
                aria-invalid={hasError}
                className='sm:flex-1'
              />
            </div>

            {/* 상세주소 */}
            <Input
              ref={addressDetailRef}
              value={value.addressDetail}
              onChange={e =>
                field.onChange({
                  ...value,
                  addressDetail: e.target.value,
                })
              }
              placeholder='상세주소를 입력하세요'
              aria-invalid={hasError}
            />
          </FieldGroup>
        );
      }}
    </FormField>
  );
};
