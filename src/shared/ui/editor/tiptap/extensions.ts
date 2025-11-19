import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { TableKit } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { Placeholder } from '@tiptap/extensions';
import type { Extensions } from '@tiptap/core';

import { NodeSelection } from '@tiptap/pm/state';
import type { Editor } from '@tiptap/core';

import { Indent } from './indent';
import { ResizableImage } from './resizable-image';

const YOUTUBE_URL_PATTERN = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)/;

export function isYoutubeUrl(url: string): boolean {
  return YOUTUBE_URL_PATTERN.test(url);
}

/**
 * 노드(이미지·영상·표)가 선택된 상태에서 새 콘텐츠를 삽입하면
 * 선택된 노드가 교체되어 사라지므로, 삽입 전에 커서를 노드 뒤로 옮긴다.
 */
export function releaseNodeSelection(editor: Editor): void {
  if (editor.state.selection instanceof NodeSelection) {
    editor.commands.setTextSelection(editor.state.selection.to);
  }
}

export function buildExtensions(placeholder: string): Extensions {
  return [
    StarterKit.configure({
      link: {
        openOnClick: false,
        defaultProtocol: 'https',
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      },
    }),
    TextStyleKit.configure({
      fontSize: { types: ['textStyle'] },
    }),
    TextAlign.configure({
      types: ['paragraph', 'heading'],
    }),
    TableKit.configure({
      table: { resizable: true },
    }),
    ResizableImage,
    Youtube.configure({
      controls: true,
      modestBranding: true,
    }),
    Indent,
    Placeholder.configure({ placeholder }),
  ];
}
