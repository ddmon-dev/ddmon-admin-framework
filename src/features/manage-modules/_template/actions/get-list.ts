import { getList as baseGetList } from '../../_base/actions/get-list';
import { CONFIG } from '../config';
import { type GetListParams } from '../../_base/config';
import { type ActionResult } from '@/shared/types/results';
import { type ItemDTO } from '../config';

export async function getList(
  params: GetListParams
): Promise<ActionResult<{ data: ItemDTO[]; totalCount: number }>> {
  return await baseGetList({ tableName: CONFIG.tableName, ...params });
}
