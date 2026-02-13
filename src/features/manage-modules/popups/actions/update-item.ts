'use server';

import { updateItem as baseUpdateItem } from '../../_base/actions/update-item';
import { CONFIG, type ItemDTO } from '../config';
import type { UpdateItemParams } from '../../_base/types';
import type { ActionResult } from '@/shared/types/results';

export async function updateItem(
  params: UpdateItemParams<ItemDTO>
): Promise<ActionResult<ItemDTO>> {
  return baseUpdateItem<ItemDTO>(CONFIG, params);
}
