'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { getUserSession } from '@/features/auth/utils/server';
import { sendEmail } from '@/shared/lib/email/send-email';
import { getReplyEmailSubject, getReplyEmailHtml } from '../reply-email';
import { type ActionResult } from '@/shared/types/results';
import { GENERAL_ERRORS, CRUD_ERRORS, VALIDATION_ERRORS } from '@/shared/constants/error-messages';
import { CONFIG, type ReplyRowData } from '../config';

const replySchema = z.object({
  inquiryId: z.string().min(1),
  content: z.string().min(1),
  pathname: z.string().min(1),
});

interface CreateReplyParams {
  inquiryId: string;
  content: string;
  pathname: string;
}

export async function createReply(params: CreateReplyParams): Promise<ActionResult<ReplyRowData>> {
  const parsed = replySchema.safeParse(params);
  if (!parsed.success) {
    console.error('[createReply] Validation failed:', parsed.error.flatten());
    return { success: false, error: VALIDATION_ERRORS.INVALID_INPUT };
  }

  const { inquiryId, content, pathname } = parsed.data;

  try {
    const user = await getUserSession();
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const supabase = createServerClient();

    // 0. 문의 정보 조회 (이메일 발송용)
    const { data: inquiry, error: inquiryError } = await supabase
      .from(CONFIG.tableName)
      .select('name, email, content')
      .eq('id', inquiryId)
      .single();

    if (inquiryError || !inquiry) {
      console.error('Inquiry fetch error:', inquiryError);
      return { success: false, error: CRUD_ERRORS.READ_FAILED('문의') };
    }

    // 1. 이메일 발송 (먼저 수행 - 실패 시 DB 저장하지 않음)
    const sentAt = new Date().toISOString();
    try {
      await sendEmail({
        to: inquiry.email,
        subject: getReplyEmailSubject(),
        html: getReplyEmailHtml({
          name: inquiry.name,
          inquiryContent: inquiry.content,
          replyContent: content,
        }),
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      return { success: false, error: '이메일 발송에 실패했습니다. 답변이 저장되지 않았습니다.' };
    }

    // 2. 답변 테이블에 저장 (이메일 발송 성공 후)
    const { data: replyData, error: replyError } = await supabase
      .from(CONFIG.replyTableName)
      .insert({
        inquiry_id: inquiryId,
        content,
        author: user.id,
        sent_at: sentAt,
      })
      .select('id, inquiry_id, content, author, sent_at, created_at, updated_at')
      .single();

    if (replyError || !replyData) {
      console.error('Create reply error:', replyError);
      return { success: false, error: CRUD_ERRORS.CREATE_FAILED('답변') };
    }

    // 3. inquiries 상태를 answered로 변경
    const { error: updateError } = await supabase
      .from(CONFIG.tableName)
      .update({ status: 'answered' })
      .eq('id', inquiryId);

    if (updateError) {
      console.error('Update inquiry status error:', updateError);
      return { success: false, error: CRUD_ERRORS.UPDATE_FAILED('문의 상태') };
    }

    revalidatePath(pathname);

    return { success: true, data: replyData as ReplyRowData };
  } catch (error) {
    console.error('Create reply error:', error);
    return { success: false, error: GENERAL_ERRORS.UNEXPECTED };
  }
}
