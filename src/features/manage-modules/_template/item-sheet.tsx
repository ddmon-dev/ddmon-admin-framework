'use client';

import { ManageSheet, useManageSheet } from '../_base/ui';
import { useManageItemData } from '../_base/hooks';
import { ItemForm } from './item-form';
import { getItem } from './actions/get-item';

export function ItemSheet() {
  const { manageSheetData } = useManageSheet();
  const { id, mode } = manageSheetData ?? {};
  const { prevValues } = useManageItemData(getItem, {
    additionalDateFields: ['birthDate'],
  });

  return (
    <ManageSheet>
      {mode === 'view' ? null : (
        <ItemForm
          id={id}
          prevValues={prevValues}
        />
      )}
    </ManageSheet>
  );
}
