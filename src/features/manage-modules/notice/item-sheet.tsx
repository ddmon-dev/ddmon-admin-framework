'use client';

import { useState, useEffect } from 'react';
import { ManageSheet, useManageSheet } from '../components/manage-sheet';
import { ItemForm } from './item-form';
import { getItem } from './actions/get-item';
import { type CamelCaseRowData } from './types';

export function ItemSheet() {
  const { manageSheetData } = useManageSheet();
  const { id } = manageSheetData ?? {};
  const [prevValues, setPrevValues] = useState<CamelCaseRowData | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;

      const { success, data, error } = await getItem({ id });

      if (!success) {
        console.error(`Data fetch error: ${error}`);
        return;
      }

      setPrevValues(data);
    };

    fetchItem();

    if (!id) {
      setPrevValues(null);
    }
  }, [id]);

  return (
    <ManageSheet>
      <ItemForm prevValues={prevValues} />
    </ManageSheet>
  );
}
