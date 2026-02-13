'use client';

import { ManageSheet } from '../_base/ui';
import { CONFIG } from './config';
import { WriteForm } from './write-form';
import { getItem } from './actions/get-item';

export function ItemSheet() {
  return <ManageSheet fetchFn={getItem} formComponent={WriteForm} moduleName={CONFIG.moduleName} />;
}
