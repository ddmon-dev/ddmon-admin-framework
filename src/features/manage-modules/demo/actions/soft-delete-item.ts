'use server';

import { softDelete } from '../../_base/actions';
import { type DeleteResult } from '../../_base/types';

import { CONFIG } from '../config';
import { type ItemDTO } from '../types';

interface Params {
  id: string;
  path?: string;
}

/**
 * Soft Delete: deleted = true로 설정
 * Storage 파일은 유지 (복구 가능)
 */
export async function softDeleteItem({ id, path }: Params): Promise<DeleteResult<ItemDTO>> {
  return await softDelete({ tableName: CONFIG.tableName, id, path });
}
