'use client';

import { cn } from '@/shared/utils/classnames';
import { CKEditor as _CKEditor } from '@ckeditor/ckeditor5-react';
import translations from 'ckeditor5/translations/ko.js';
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  AutoImage,
  AutoLink,
  Autosave,
  Bold,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontSize,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import './theme.css';
import { CustomUploadAdapterPlugin } from './custom-upload-adapter';
import { DEFAULT_IMAGE_CONFIG } from './config';
import { generateUploadPath } from './utils';

interface CKEditorProps {
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
  ref?: React.Ref<any>;
}

export function CKEditor({
  content = '',
  onChange,
  placeholder = '내용을 입력하세요...',
  disabled = false,
  className,
  uploadFolder,
  entity,
  maxImageSizeMB = DEFAULT_IMAGE_CONFIG.maxSizeMB,
  acceptedImageFormats = DEFAULT_IMAGE_CONFIG.acceptedFormats,
  ref,
}: CKEditorProps) {
  const finalUploadFolder = generateUploadPath(uploadFolder, entity);

  return (
    <div
      ref={ref}
      className={cn('w-full', className)}
      tabIndex={-1}
    >
      <_CKEditor
        editor={ClassicEditor}
        data={content}
        disabled={disabled}
        onReady={editor => {
          // 커스텀 업로드 어댑터 등록
          CustomUploadAdapterPlugin({
            folder: finalUploadFolder,
            maxSizeMB: maxImageSizeMB,
            acceptedFormats: acceptedImageFormats,
          })(editor);
        }}
        config={{
          licenseKey: 'GPL',
          translations: [translations],
          toolbar: {
            items: [
              // 'heading',
              '|',
              'fontSize',
              // 'fontFamily',
              'fontColor',
              'fontBackgroundColor',
              // 'highlight',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'subscript',
              'superscript',
              // 'code',
              'removeFormat',
              '|',
              'link',
              'insertImage',
              'mediaEmbed',
              'insertTable',
              // 'blockQuote',
              // 'codeBlock',
              // 'horizontalLine',
              'specialCharacters',
              '|',
              'alignment',
              '|',
              'bulletedList',
              'numberedList',
              'todoList',
              '|',
              'outdent',
              'indent',
              '|',
              'findAndReplace',
              'undo',
              'redo',
            ],
            shouldNotGroupWhenFull: false,
          },
          plugins: [
            AccessibilityHelp,
            Alignment,
            AutoImage,
            AutoLink,
            Autosave,
            // BlockQuote,
            Bold,
            // Code,
            // CodeBlock,
            Essentials,
            FindAndReplace,
            FontBackgroundColor,
            FontColor,
            // FontFamily,
            FontSize,
            // Heading,
            // Highlight,
            // HorizontalLine,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsert,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            MediaEmbed,
            Paragraph,
            PasteFromOffice,
            RemoveFormat,
            SelectAll,
            SpecialCharacters,
            SpecialCharactersArrows,
            SpecialCharactersCurrency,
            SpecialCharactersEssentials,
            SpecialCharactersLatin,
            SpecialCharactersMathematical,
            SpecialCharactersText,
            Strikethrough,
            Subscript,
            Superscript,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            TodoList,
            Underline,
            Undo,
          ],
          // fontFamily: {
          //   supportAllValues: true,
          // },
          fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22, 24, 26, 28, 30],
            supportAllValues: true,
          },
          // heading: {
          //   options: [
          //     { model: 'paragraph', title: '본문', class: 'ck-heading_paragraph' },
          //     { model: 'heading1', view: 'h1', title: '제목 1', class: 'ck-heading_heading1' },
          //     { model: 'heading2', view: 'h2', title: '제목 2', class: 'ck-heading_heading2' },
          //     { model: 'heading3', view: 'h3', title: '제목 3', class: 'ck-heading_heading3' },
          //     { model: 'heading4', view: 'h4', title: '제목 4', class: 'ck-heading_heading4' },
          //     { model: 'heading5', view: 'h5', title: '제목 5', class: 'ck-heading_heading5' },
          //     { model: 'heading6', view: 'h6', title: '제목 6', class: 'ck-heading_heading6' },
          //   ],
          // },
          image: {
            toolbar: [
              'imageTextAlternative',
              'toggleImageCaption',
              '|',
              'imageStyle:inline',
              'imageStyle:wrapText',
              'imageStyle:breakText',
              '|',
              'resizeImage',
            ],
          },
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
              toggleDownloadable: {
                mode: 'manual',
                label: '다운로드 가능',
                attributes: {
                  download: 'file',
                },
              },
            },
          },
          list: {
            properties: {
              styles: true,
              startIndex: true,
              reversed: true,
            },
          },
          placeholder,
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableProperties',
              'tableCellProperties',
            ],
          },
        }}
        onChange={(_event, editor) => {
          const data = editor.getData();
          onChange?.(data);
        }}
      />
    </div>
  );
}
