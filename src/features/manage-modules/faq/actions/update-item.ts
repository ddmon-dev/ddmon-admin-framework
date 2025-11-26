import { updateItem as baseUpdateItem } from '../../_base/actions/update-item';
import { CONFIG } from '../config';
import { type UpdateItemParams } from '../../_base/config';
import { type ActionResult } from '@/shared/types/results';
import { type ItemDTO } from '../config';

export async function updateItem(
  params: UpdateItemParams<ItemDTO>
): Promise<ActionResult<ItemDTO>> {
  return await baseUpdateItem({ tableName: CONFIG.tableName, ...params });
}
