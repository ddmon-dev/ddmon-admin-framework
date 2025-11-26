import { getItem as baseGetItem } from '../../_base/actions/get-item';
import { CONFIG } from '../config';
import { type GetItemParams } from '../../_base/config';
import { type ActionResult } from '@/shared/types/action-results';
import { type ItemDTO } from '../config';

export async function getItem(params: GetItemParams): Promise<ActionResult<ItemDTO>> {
  return await baseGetItem({ tableName: CONFIG.tableName, ...params });
}
