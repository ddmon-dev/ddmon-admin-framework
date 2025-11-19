'use client';

import { useRef, useState } from 'react';
import { useEditorState, type Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Grid3x3,
  Highlighter,
  Image as ImageIcon,
  Indent as IndentIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Outdent as OutdentIcon,
  Palette,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Youtube as YoutubeIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/shared/utils/classnames';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Toggle } from '@/shared/ui/toggle';
import { Separator } from '@/shared/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import { isYoutubeUrl, releaseNodeSelection } from './extensions';

const FONT_SIZES = [10, 12, 14, 18, 20, 22, 24, 26, 28, 30];

const COLOR_PALETTE = [
  { label: '검정', value: '#000000' },
  { label: '진회색', value: '#4d4d4d' },
  { label: '회색', value: '#999999' },
  { label: '밝은 회색', value: '#e6e6e6' },
  { label: '흰색', value: '#ffffff' },
  { label: '빨강', value: '#e64c4c' },
  { label: '주황', value: '#e6994c' },
  { label: '노랑', value: '#e6e64c' },
  { label: '연두', value: '#99e64c' },
  { label: '초록', value: '#4ce64c' },
  { label: '민트', value: '#4ce699' },
  { label: '청록', value: '#4ce6e6' },
  { label: '하늘', value: '#4c99e6' },
  { label: '파랑', value: '#4c4ce6' },
  { label: '보라', value: '#994ce6' },
];

const ALIGNMENTS = [
  { value: 'left', label: '왼쪽 정렬', icon: AlignLeft },
  { value: 'center', label: '가운데 정렬', icon: AlignCenter },
  { value: 'right', label: '오른쪽 정렬', icon: AlignRight },
  { value: 'justify', label: '양쪽 정렬', icon: AlignJustify },
] as const;

const TABLE_GRID_MAX = 5;

interface ToolbarProps {
  editor: Editor;
  onImageSelect: (files: File[]) => void;
  acceptedFormats: string[];
}

export function Toolbar({ editor, onImageSelect, acceptedFormats }: ToolbarProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      fontSize: (e.getAttributes('textStyle').fontSize as string | undefined) ?? 'default',
      color: (e.getAttributes('textStyle').color as string | undefined) ?? null,
      backgroundColor: (e.getAttributes('textStyle').backgroundColor as string | undefined) ?? null,
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      link: e.isActive('link'),
      linkHref: (e.getAttributes('link').href as string | undefined) ?? '',
      table: e.isActive('table'),
      align: ALIGNMENTS.find(({ value }) => e.isActive({ textAlign: value }))?.value ?? 'left',
      bulletList: e.isActive('bulletList'),
      orderedList: e.isActive('orderedList'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
      editable: e.isEditable,
    }),
  });

  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex flex-wrap items-center gap-0.5 rounded-t-lg border-b p-1',
        'bg-[color-mix(in_srgb,var(--muted)_30%,var(--background))]',
        !state.editable && 'pointer-events-none opacity-50'
      )}
    >
      <FontSizeSelect editor={editor} value={state.fontSize} />

      <ColorPicker
        icon={Palette}
        label="글자 색"
        current={state.color}
        onSelect={(color) => editor.chain().focus().setColor(color).run()}
        onClear={() => editor.chain().focus().unsetColor().run()}
      />
      <ColorPicker
        icon={Highlighter}
        label="글자 배경색"
        current={state.backgroundColor}
        onSelect={(color) => editor.chain().focus().setBackgroundColor(color).run()}
        onClear={() => editor.chain().focus().unsetBackgroundColor().run()}
      />

      <ToolbarDivider />

      <ToolbarToggle
        label="굵게"
        pressed={state.bold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </ToolbarToggle>
      <ToolbarToggle
        label="기울임"
        pressed={state.italic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </ToolbarToggle>
      <ToolbarToggle
        label="밑줄"
        pressed={state.underline}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </ToolbarToggle>
      <ToolbarToggle
        label="취소선"
        pressed={state.strike}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough />
      </ToolbarToggle>

      <ToolbarDivider />

      <LinkPopover editor={editor} active={state.link} currentHref={state.linkHref} />
      <ImageButton onImageSelect={onImageSelect} acceptedFormats={acceptedFormats} />
      <YoutubePopover editor={editor} />
      <TablePopover editor={editor} />
      {state.table && <TableEditMenu editor={editor} />}

      <ToolbarDivider />

      {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
        <ToolbarToggle
          key={value}
          label={label}
          pressed={state.align === value}
          onPressedChange={() => editor.chain().focus().setTextAlign(value).run()}
        >
          <Icon />
        </ToolbarToggle>
      ))}

      <ToolbarDivider />

      <ToolbarToggle
        label="글머리 기호 목록"
        pressed={state.bulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </ToolbarToggle>
      <ToolbarToggle
        label="번호 목록"
        pressed={state.orderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered />
      </ToolbarToggle>

      <ToolbarDivider />

      <ToolbarButton label="내어쓰기" onClick={() => editor.chain().focus().outdent().run()}>
        <OutdentIcon />
      </ToolbarButton>
      <ToolbarButton label="들여쓰기" onClick={() => editor.chain().focus().indent().run()}>
        <IndentIcon />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        label="실행 취소"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton
        label="다시 실행"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 />
      </ToolbarButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 공용 소품                                                            */
/* ------------------------------------------------------------------ */

function ToolbarDivider() {
  return <Separator orientation="vertical" className="mx-1 h-5!" />;
}

function ToolbarToggle({
  label,
  ...props
}: React.ComponentProps<typeof Toggle> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle size="sm" aria-label={label} {...props} />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function ToolbarButton({
  label,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={label} {...props} />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/* ------------------------------------------------------------------ */
/* 폰트 크기                                                            */
/* ------------------------------------------------------------------ */

function FontSizeSelect({ editor, value }: { editor: Editor; value: string }) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next === 'default') {
          editor.chain().focus().unsetFontSize().run();
        } else {
          editor.chain().focus().setFontSize(next).run();
        }
      }}
    >
      <SelectTrigger size="sm" className="w-21 shrink-0 border-none bg-transparent shadow-none">
        <SelectValue placeholder="크기" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">기본</SelectItem>
        {FONT_SIZES.map((size) => (
          <SelectItem key={size} value={`${size}px`}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ------------------------------------------------------------------ */
/* 색상                                                                 */
/* ------------------------------------------------------------------ */

function ColorPicker({
  icon: Icon,
  label,
  current,
  onSelect,
  onClear,
}: {
  icon: typeof Palette;
  label: string;
  current: string | null;
  onSelect: (color: string) => void;
  onClear: () => void;
}) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label={label}>
              <Icon style={current ? { color: current } : undefined} />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-auto p-2">
        <div className="grid grid-cols-5 gap-1">
          {COLOR_PALETTE.map(({ label: colorLabel, value }) => (
            <button
              key={value}
              type="button"
              aria-label={colorLabel}
              title={colorLabel}
              onClick={() => onSelect(value)}
              className={cn(
                'size-6 rounded-sm border transition-transform hover:scale-110',
                current?.toLowerCase() === value && 'ring-2 ring-primary ring-offset-1'
              )}
              style={{ backgroundColor: value }}
            />
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-2 w-full" onClick={onClear}>
          색 제거
        </Button>
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------------ */
/* 링크                                                                 */
/* ------------------------------------------------------------------ */

function LinkPopover({
  editor,
  active,
  currentHref,
}: {
  editor: Editor;
  active: boolean;
  currentHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  function apply() {
    const trimmed = url.trim();
    if (!trimmed) return;

    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run();
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setUrl(currentHref);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Toggle size="sm" aria-label="링크" pressed={active}>
              <LinkIcon />
            </Toggle>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>링크</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-80 p-2">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                apply();
              }
            }}
            placeholder="https://example.com"
            className="h-8"
          />
          <Button type="button" size="sm" onClick={apply}>
            적용
          </Button>
          {active && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                setOpen(false);
              }}
            >
              제거
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------------ */
/* 이미지                                                               */
/* ------------------------------------------------------------------ */

function ImageButton({
  onImageSelect,
  acceptedFormats,
}: {
  onImageSelect: (files: File[]) => void;
  acceptedFormats: string[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <ToolbarButton label="이미지 삽입" onClick={() => inputRef.current?.click()}>
        <ImageIcon />
      </ToolbarButton>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        multiple
        hidden
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onImageSelect(files);
          event.target.value = '';
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 유튜브                                                               */
/* ------------------------------------------------------------------ */

function YoutubePopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  function insert() {
    const trimmed = url.trim();
    if (!isYoutubeUrl(trimmed)) {
      toast.error('유튜브 링크를 입력해주세요.');
      return;
    }

    releaseNodeSelection(editor);
    editor.chain().focus().setYoutubeVideo({ src: trimmed }).run();
    setUrl('');
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setUrl('');
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="유튜브 삽입">
              <YoutubeIcon />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>유튜브 삽입</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-80 p-2">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                insert();
              }
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="h-8"
          />
          <Button type="button" size="sm" onClick={insert}>
            삽입
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------------ */
/* 표                                                                   */
/* ------------------------------------------------------------------ */

function TablePopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState({ rows: 0, cols: 0 });

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setHovered({ rows: 0, cols: 0 });
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="표 삽입">
              <Grid3x3 />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>표 삽입</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-auto p-2">
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: TABLE_GRID_MAX * TABLE_GRID_MAX }, (_, index) => {
            const row = Math.floor(index / TABLE_GRID_MAX) + 1;
            const col = (index % TABLE_GRID_MAX) + 1;
            const isActive = row <= hovered.rows && col <= hovered.cols;

            return (
              <button
                key={index}
                type="button"
                aria-label={`${row}×${col} 표`}
                onMouseEnter={() => setHovered({ rows: row, cols: col })}
                onClick={() => {
                  releaseNodeSelection(editor);
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: row, cols: col, withHeaderRow: true })
                    .run();
                  setOpen(false);
                }}
                className={cn(
                  'size-5 rounded-xs border',
                  isActive ? 'border-primary bg-primary/30' : 'bg-background'
                )}
              />
            );
          })}
        </div>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          {hovered.rows > 0 ? `${hovered.rows} × ${hovered.cols}` : '크기 선택'}
        </p>
      </PopoverContent>
    </Popover>
  );
}

function TableEditMenu({ editor }: { editor: Editor }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="px-2 text-xs">
          표 편집
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
          위에 행 추가
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
          아래에 행 추가
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
          행 삭제
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
          왼쪽에 열 추가
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
          오른쪽에 열 추가
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
          열 삭제
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!editor.can().mergeCells()}
          onClick={() => editor.chain().focus().mergeCells().run()}
        >
          셀 병합
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!editor.can().splitCell()}
          onClick={() => editor.chain().focus().splitCell().run()}
        >
          셀 분할
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
          헤더 행 전환
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          표 삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
