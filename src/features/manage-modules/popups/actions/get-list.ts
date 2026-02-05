'use server';

import { getList as baseGetList } from '../../_base/actions/get-list';
import { CONFIG, type ItemDTO } from '../config';
import type { GetListParams, ListProps } from '../../_base/types';
import type { ActionResult } from '@/shared/types/results';

export async function getList(params: GetListParams): Promise<ActionResult<ListProps<ItemDTO>>> {
  return baseGetList<ItemDTO>(CONFIG, params);
}
