import { Extension } from '@tiptap/core';

const INDENT_STEP_PX = 40;
const MAX_INDENT = 8;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      /** 들여쓰기 (리스트 안에서는 리스트 중첩) */
      indent: () => ReturnType;
      /** 내어쓰기 (리스트 안에서는 리스트 중첩 해제) */
      outdent: () => ReturnType;
    };
  }
}

/**
 * 단락·제목 들여쓰기 확장
 *
 * margin-left 인라인 스타일로 저장하므로 렌더링(RichTextContent)에
 * 별도 처리가 필요 없습니다.
 */
export const Indent = Extension.create({
  name: 'indent',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const marginLeft = parseInt(element.style.marginLeft || '0', 10);
              if (Number.isNaN(marginLeft) || marginLeft <= 0) return 0;
              return Math.min(Math.round(marginLeft / INDENT_STEP_PX), MAX_INDENT);
            },
            renderHTML: (attributes) => {
              if (!attributes.indent) return {};
              return { style: `margin-left:${attributes.indent * INDENT_STEP_PX}px` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ editor, commands }) => {
          if (editor.isActive('listItem')) {
            return commands.sinkListItem('listItem');
          }
          const type = editor.isActive('heading') ? 'heading' : 'paragraph';
          const current: number = editor.getAttributes(type).indent ?? 0;
          if (current >= MAX_INDENT) return false;
          return commands.updateAttributes(type, { indent: current + 1 });
        },
      outdent:
        () =>
        ({ editor, commands }) => {
          if (editor.isActive('listItem')) {
            return commands.liftListItem('listItem');
          }
          const type = editor.isActive('heading') ? 'heading' : 'paragraph';
          const current: number = editor.getAttributes(type).indent ?? 0;
          if (current <= 0) return false;
          return commands.updateAttributes(type, { indent: current - 1 });
        },
    };
  },
});
