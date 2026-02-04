'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { VALIDATION_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { CONFIG, type InquiryWithReplies } from '../config';
import { type GetItemParams } from '../../_base/types';

export const getItem = createServerAction<GetItemParams, InquiryWithReplies>({
  name: 'getItem',
  auth: true,
  handler: async ({ id }) => {
    if (!id) {
      return Result.error(VALIDATION_ERRORS.NO_ID);
    }

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
  },
});
