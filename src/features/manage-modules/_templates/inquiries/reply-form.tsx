'use client';

import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { FormTextarea } from '@/shared/ui/form';
import { Loader2 } from 'lucide-react';

import { createReply } from './actions';
import { type ReplyRowData } from './config';
import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { GENERAL_ERRORS } from '@/shared/constants/error-messages';

const formSchema = z.object({
  replyContent: z.string().min(1, '답변 내용을 입력해주세요.'),
});

interface ReplyFormProps {
  inquiryId: string;
  onReplyCreated?: (reply: ReplyRowData) => void;
}

export function ReplyForm({ inquiryId, onReplyCreated }: ReplyFormProps) {
  const pathname = usePathname();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      replyContent: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { success, data, error } = await createReply({
        inquiryId,
        content: values.replyContent,
        pathname,
      });

      if (!success || !data) {
        toast.error(error);
        return;
      }

      toast.success(SUCCESS_MESSAGES.CREATE_SUCCESS('답변'));
      form.reset();
      onReplyCreated?.(data);
    } catch (error) {
      console.error(error);
      toast.error(GENERAL_ERRORS.UNEXPECTED);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className='space-y-2'>
        <FormTextarea
          control={form.control}
          name='replyContent'
          label='답변 내용'
          placeholder='답변 내용을 입력하세요'
          rows={6}
        />
        <div className='flex justify-end'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
            답변 저장
          </Button>
        </div>
      </div>
    </form>
  );
}
