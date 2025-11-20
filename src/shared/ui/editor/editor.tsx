'use client';

import dynamic from 'next/dynamic';
import { type CKEditor as CKEditorType } from './ckeditor';

const EDITOR_COMPONENT = './ckeditor';

export const Editor = dynamic(
  () => import(EDITOR_COMPONENT).then(mod => ({ default: mod.CKEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
) as typeof CKEditorType;

function EditorSkeleton() {
  return (
    <div className='flex h-[300px] items-center justify-center text-sm text-muted-foreground'>
      에디터 로딩 중...
    </div>
  );
}
