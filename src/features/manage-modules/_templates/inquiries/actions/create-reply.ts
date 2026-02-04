'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { getUserSession } from '@/features/auth/utils/server';
import { sendEmail } from '@/shared/lib/email/send-email';
import {
  getInquiryReplyEmailSubject,
  getInquiryReplyEmailHtml,
} from '@/shared/lib/email/templates/inquiry-reply';
import { type ActionResult } from '@/shared/types/results';
import { GENERAL_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { CONFIG, type ReplyRowData } from '../config';

interface CreateReplyParams {
  inquiryId: string;
  content: string;
  pathname: string;
}

export async function createReply({
  inquiryId,
  content,
  pathname,
}: CreateReplyParams): Promise<ActionResult<ReplyRowData>> {
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

    // 1. inquiry_replies 테이블에 답변 저장 (이메일 발송 시각 기록)
    const sentAt = new Date().toISOString();
    const { data: replyData, error: replyError } = await supabase
      .from('inquiry_replies')
      .insert({
        inquiry_id: inquiryId,
        content,
        author: user.name ?? user.id,
        sent_at: sentAt,
      })
      .select('id, inquiry_id, content, author, sent_at, created_at, updated_at')
      .single();

    if (replyError || !replyData) {
      console.error('Create reply error:', replyError);
      return { success: false, error: CRUD_ERRORS.CREATE_FAILED('답변') };
    }

    // 2. inquiries 상태를 answered로 변경
    const { error: updateError } = await supabase
      .from(CONFIG.tableName)
      .update({ status: 'answered' })
      .eq('id', inquiryId);

    if (updateError) {
      console.error('Update inquiry status error:', updateError);
      return { success: false, error: CRUD_ERRORS.UPDATE_FAILED('문의 상태') };
    }

    // 3. 이메일 발송 (항상 발송)
    try {
      await sendEmail({
        to: inquiry.email,
        subject: getInquiryReplyEmailSubject(),
        html: getInquiryReplyEmailHtml({
          name: inquiry.name,
          inquiryContent: inquiry.content,
          replyContent: content,
        }),
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // 이메일 발송 실패해도 답변은 저장되었으므로 성공 처리
      // 단, 로그만 남김
    }

    revalidatePath(pathname);

    return { success: true, data: replyData as ReplyRowData };
  } catch (error) {
    console.error('Create reply error:', error);
    return { success: false, error: GENERAL_ERRORS.UNEXPECTED };
  }
}
