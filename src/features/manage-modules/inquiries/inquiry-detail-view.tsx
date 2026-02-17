'use client';

import { useState } from 'react';
import { SheetBody, SheetContainer, SheetFooter } from '@/shared/ui/sheet';
import { ManageSheetClose } from '../_base/ui';
import { InquiryInfo } from './inquiry-info';
import { ReplyForm } from './reply-form';
import { ReplyList } from './reply-list';
import { type InquiryWithReplies, type ReplyRowData } from './config';

interface InquiryDetailViewProps {
  data: InquiryWithReplies;
}

export function InquiryDetailView({ data }: InquiryDetailViewProps) {
  const [replies, setReplies] = useState<ReplyRowData[]>(data.replies ?? []);

  const handleReplyCreated = (newReply: ReplyRowData) => {
    setReplies((prev) => [newReply, ...prev]);
  };

  return (
    <>
      <SheetBody>
        <SheetContainer className="space-y-8">
          <InquiryInfo data={data} />
          <ReplyForm inquiryId={data.id} onReplyCreated={handleReplyCreated} />
          <ReplyList replies={replies} />
        </SheetContainer>
      </SheetBody>
      <SheetFooter>
        <ManageSheetClose />
      </SheetFooter>
    </>
  );
}
