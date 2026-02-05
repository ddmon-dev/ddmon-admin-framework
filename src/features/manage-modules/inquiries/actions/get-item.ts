'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { requireAuth } from '@/features/auth';
import { Result } from '@/shared/utils/results';
import { GENERAL_ERRORS, VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import type { ActionResult } from '@/shared/types/results';
import { CONFIG, type InquiryWithReplies } from '../config';
import type { GetItemParams } from '../../_base/types';

export async function getItem(params: GetItemParams): Promise<ActionResult<InquiryWithReplies>> {
  const { id } = params;

  if (!id) {
    return Result.error(VALIDATION_ERRORS.NO_ID);
  }

  await requireAuth();

  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .select(`
        *,
        replies:${CONFIG.replyTableName}(
          id,
          content,
          author,
          sent_at,
          created_at
        )
      `)
      .eq('id', id)
      .order('created_at', { referencedTable: CONFIG.replyTableName, ascending: false })
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Result.error(CRUD_ERRORS.READ_FAILED());
    }

    return Result.success(data as InquiryWithReplies);
  } catch (error) {
    console.error('[getItem] Unexpected error:', error);
    return Result.error(GENERAL_ERRORS.UNEXPECTED);
  }
}
