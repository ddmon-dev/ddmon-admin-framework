'use client';

import { ManageSheet } from '../_base/ui';
import { CONFIG } from './config';
import { WriteForm } from './write-form';
import { DetailView } from './detail-view';
import { getItem } from './actions/get-item';

export function ItemSheet() {
  return (
    <ManageSheet
      fetchFn={getItem}
      formComponent={WriteForm}
      viewComponent={DetailView}
      moduleName={CONFIG.moduleName}
    />
  );
}
