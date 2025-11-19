'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import { type TiptapEditor as TiptapEditorType, type TiptapEditorProps } from './tiptap';

export type EditorProps = TiptapEditorProps;

const EDITOR_COMPONENT = './tiptap';

export const Editor = dynamic(
  () => import(EDITOR_COMPONENT).then((mod) => ({ default: mod.TiptapEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
) as typeof TiptapEditorType;

function EditorSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      {/* 툴바 영역 */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        <Skeleton className="size-7 rounded" />
        <Skeleton className="size-7 rounded" />
        <Skeleton className="size-7 rounded" />
        <div className="w-px h-5 bg-border mx-1" />
        <Skeleton className="size-7 rounded" />
        <Skeleton className="size-7 rounded" />
        <div className="w-px h-5 bg-border mx-1" />
        <Skeleton className="size-7 rounded" />
        <Skeleton className="size-7 rounded" />
        <Skeleton className="size-7 rounded" />
      </div>
      {/* 에디터 본문 영역 */}
      <div className="p-4 space-y-3 min-h-[250px]">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
