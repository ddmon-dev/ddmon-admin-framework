'use client';

import { ManageSheet } from '../_base/ui';
import { CONFIG } from './config';
import { ItemForm } from './item-form';
import { getItem } from './actions/get-item';

export function ItemSheet() {
  return (
    <ManageSheet
      fetchFn={getItem}
      formComponent={ItemForm}
      moduleName={CONFIG.moduleName}
    />
  );
}
