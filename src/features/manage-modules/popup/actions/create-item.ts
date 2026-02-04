import { createItem as baseCreateItem } from '../../_base/actions/create-item';
import { CONFIG } from '../config';
import { type CreateItemParams } from '../../_base/types';
import { type ActionResult } from '@/shared/types/results';
import { type ItemDTO } from '../config';

export async function createItem(
  params: CreateItemParams<ItemDTO>
): Promise<ActionResult<ItemDTO>> {
  return await baseCreateItem({ tableName: CONFIG.tableName, ...params });
}
