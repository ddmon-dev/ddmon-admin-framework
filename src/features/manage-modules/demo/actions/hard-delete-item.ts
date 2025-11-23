'use server';

import { hardDelete } from '../../_base/actions';
import { type DeleteResult } from '../../_base/types';

import { CONFIG } from '../config';
import { type ItemDTO } from '../types';

interface Params {
  id: string;
  path?: string;
}

/**
 * 영구 삭제 (복구 불가능)
 * DB에서 완전히 삭제하고 Storage 폴더 전체 삭제
 */
export async function hardDeleteItem({ id, path }: Params): Promise<DeleteResult<ItemDTO>> {
  return await hardDelete({ tableName: CONFIG.tableName, id, path });
}
