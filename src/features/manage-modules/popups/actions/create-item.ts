'use server';

import { createItem as baseCreateItem } from '../../_base/actions/create-item';
import { CONFIG, type ItemDTO } from '../config';
import type { CreateItemParams } from '../../_base/types';
import type { ActionResult } from '@/shared/types/results';

export async function createItem(
  params: CreateItemParams<ItemDTO>
): Promise<ActionResult<ItemDTO>> {
  return baseCreateItem<ItemDTO>(CONFIG, params);
}
