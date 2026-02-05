import { getItem as baseGetItem } from '../../_base/actions/get-item';
import { CONFIG, type ItemDTO } from '../config';
import { type GetItemParams } from '../../_base/types';
import { type ActionResult } from '@/shared/types/results';

export async function getItem(params: GetItemParams): Promise<ActionResult<ItemDTO>> {
  return await baseGetItem({ ...CONFIG, ...params });
}
