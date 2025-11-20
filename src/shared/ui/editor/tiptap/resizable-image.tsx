import Image from '@tiptap/extension-image';
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react';
import { useRef } from 'react';

import { cn } from '@/shared/utils/classnames';

const MIN_WIDTH_PX = 80;

/**
 * 이미지 확장 + 드래그 리사이즈
 *
 * width 속성을 px 단위 인라인 스타일로 저장 → RichTextContent에서 그대로 렌더링
 */
export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const width = parseInt(element.style.width || element.getAttribute('width') || '', 10);
          return !Number.isNaN(width) && width > 0 ? width : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { style: `width:${attributes.width}px` };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});

function ResizableImageView({ node, updateAttributes, selected, editor }: NodeViewProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  function startResize(event: React.PointerEvent) {
    event.preventDefault();
    event.stopPropagation();

    const image = imageRef.current;
    if (!image) return;

    const startX = event.clientX;
    const startWidth = image.offsetWidth;
    const maxWidth = image.parentElement?.parentElement?.clientWidth ?? Infinity;

    function onPointerMove(moveEvent: PointerEvent) {
      const nextWidth = Math.round(
        Math.min(Math.max(startWidth + (moveEvent.clientX - startX), MIN_WIDTH_PX), maxWidth)
      );
      updateAttributes({ width: nextWidth });
    }

    function onPointerUp() {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  return (
    <NodeViewWrapper className="tiptap-image" data-drag-handle>
      <span
        className={cn(
          'relative inline-block max-w-full',
          selected && 'outline-2 outline-primary outline-offset-2 rounded-xs'
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt ?? ''}
          title={node.attrs.title ?? undefined}
          style={node.attrs.width ? { width: node.attrs.width } : undefined}
          className="block h-auto max-w-full"
        />
        {selected && editor.isEditable && (
          <span
            role="presentation"
            onPointerDown={startResize}
            className="absolute -right-1.5 -bottom-1.5 size-3 cursor-nwse-resize rounded-full border-2 border-background bg-primary"
          />
        )}
      </span>
    </NodeViewWrapper>
  );
}
