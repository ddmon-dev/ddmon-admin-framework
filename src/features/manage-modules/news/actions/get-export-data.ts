'use server';

import { getExportData as baseGetExportData } from '../../_base/actions/get-export-data';
import { type ActionResult } from '@/shared/types/results';
import { CONFIG, type ItemDTO } from '../config';

export async function getExportData(): Promise<ActionResult<ItemDTO[]>> {
  return await baseGetExportData(CONFIG);
}
