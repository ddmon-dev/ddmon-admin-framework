'use client';

import { useMemo } from 'react';
import { ManageSheet, useManageSheet } from '../_base/components';
import { useManageItem } from '../_base/hooks';
import { ItemForm } from './item-form';
import { getItem } from './actions/get-item';

export function ItemSheet() {
  const { manageSheetData } = useManageSheet();
  const { id, mode } = manageSheetData ?? {};
  const { prevValues } = useManageItem(getItem, {
    additionalDateFields: ['birthDate'],
  });

  // DB의 개별 필드를 주소 객체로 변환
  const transformedValues = useMemo(() => {
    if (!prevValues) return null;

    const { zipCode, address, addressDetail, ...rest } = prevValues as any;

    return {
      ...rest,
      address: {
        zipCode: zipCode || '',
        address: address || '',
        addressDetail: addressDetail || '',
      },
    };
  }, [prevValues]);

  return (
    <ManageSheet>
      {mode === 'view' ? null : (
        <ItemForm
          id={id}
          prevValues={transformedValues}
        />
      )}
    </ManageSheet>
  );
}
