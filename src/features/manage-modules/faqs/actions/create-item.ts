'use server';

import { createItem as baseCreateItem } from '../../_base/actions/create-item';
import { CONFIG, type ItemDTO } from '../config';
import { type CreateItemParams } from '../../_base/types';

export async function createItem(params: CreateItemParams<ItemDTO>) {
  return baseCreateItem({
    tableName: CONFIG.tableName,
    enableReorder: CONFIG.enableReorder,
    ...params,
  });
}
