'use client';

import { useEffect, useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';

import { cn } from '@/shared/utils/classnames';

import { buildExtensions } from './extensions';
import { Toolbar } from './toolbar';
import { insertImages, type EditorUploadConfig } from './image-upload';
import { generateUploadPath } from './utils';
import { UPLOAD_CONFIG } from './config';
import './theme.css';

export interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** 업로드 폴더 경로 (우선순위 1: 명시적 경로) */
  uploadFolder?: string;
  /** 엔티티명 (우선순위 2: 자동 경로 생성용, 예: 'notices') */
  entity?: string;
  /** 최대 이미지 크기 (MB 단위, 기본값: 2) */
  maxImageSizeMB?: number;
  /** 허용되는 이미지 형식 (기본값: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) */
  acceptedImageFormats?: string[];
  ref?: React.Ref<HTMLDivElement>;
}

export function TiptapEditor({
  content = '',
  onChange,
  placeholder = '내용을 입력하세요...',
  disabled = false,
  className,
  uploadFolder,
  entity,
  maxImageSizeMB,
  acceptedImageFormats,
  ref,
}: TiptapEditorProps) {
  const uploadConfig = useMemo<EditorUploadConfig>(
    () => ({
      folder: generateUploadPath(uploadFolder, entity),
      maxSizeMB: maxImageSizeMB,
      acceptedFormats: acceptedImageFormats,
    }),
    [uploadFolder, entity, maxImageSizeMB, acceptedImageFormats]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: buildExtensions(placeholder),
    content,
    editable: !disabled,
    onUpdate: ({ editor: e }) => {
      onChange?.(e.isEmpty ? '' : e.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content focus:outline-none',
      },
      handlePaste: (_view, event) => {
        const files = collectImageFiles(event.clipboardData?.files);
        if (files.length === 0) return false;

        event.preventDefault();
        if (editor) insertImages(editor, files, uploadConfig);
        return true;
      },
      handleDrop: (_view, event) => {
        const files = collectImageFiles(event.dataTransfer?.files);
        if (files.length === 0) return false;

        event.preventDefault();
        if (editor) insertImages(editor, files, uploadConfig);
        return true;
      },
    },
  });

  // 외부에서 content가 바뀐 경우 반영 (form.reset 등)
  useEffect(() => {
    if (!editor) return;

    const current = editor.isEmpty ? '' : editor.getHTML();
    if (content !== current) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  useEffect(() => {
    editor?.setEditable(!disabled, false);
  }, [editor, disabled]);

  return (
    <div ref={ref} tabIndex={-1} className={cn('w-full', className)}>
      <div
        className={cn(
          'rounded-lg border bg-background transition-[color,box-shadow]',
          'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
          disabled && 'pointer-events-none opacity-60'
        )}
      >
        {editor && (
          <Toolbar
            editor={editor}
            acceptedFormats={uploadConfig.acceptedFormats ?? UPLOAD_CONFIG.acceptedFormats}
            onImageSelect={(files) => insertImages(editor, files, uploadConfig)}
          />
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function collectImageFiles(fileList: FileList | undefined | null): File[] {
  return Array.from(fileList ?? []).filter((file) => file.type.startsWith('image/'));
}
