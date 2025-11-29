'use client';

import { useState, useEffect } from 'react';
import { Type, Check } from 'lucide-react';
import { cn } from '@/shared/utils/classnames';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

type FontOption = {
  id: string;
  name: string;
  variable: string;
  description: string;
};

const FONT_OPTIONS: FontOption[] = [
  {
    id: 'pretendard',
    name: 'Pretendard',
    variable: '--font-pretendard',
    description: '깔끔하고 현대적인 산세리프',
  },
  {
    id: 'nanum-square-neo',
    name: '나눔스퀘어 네오',
    variable: '--font-nanum-square-neo',
    description: '둥글둥글하고 부드러운 느낌',
  },
  {
    id: 'suit',
    name: 'SUIT',
    variable: '--font-suit',
    description: '둥글고 친근한 느낌',
  },
  {
    id: 'gothic-a1',
    name: 'Gothic A1',
    variable: '--font-gothic-a1',
    description: '깔끔하고 모던한 고딕체',
  },
  {
    id: 'nanum-gothic',
    name: '나눔고딕',
    variable: '--font-nanum-gothic',
    description: '친숙하고 가독성 좋은 고딕체',
  },
  {
    id: 'noto-sans-kr',
    name: 'Noto Sans KR',
    variable: '--font-noto-sans-kr',
    description: '구글의 범용 한글 폰트',
  },
  {
    id: 'ibm-plex-sans-kr',
    name: 'IBM Plex Sans KR',
    variable: '--font-ibm-plex-sans-kr',
    description: '깔끔하고 기술적인 느낌',
  },
];

const STORAGE_KEY = 'admin-template-font';

export function FontSwitcher() {
  const [selectedFont, setSelectedFont] = useState<string>('pretendard');
  const [open, setOpen] = useState(false);

  // 초기 로드 시 localStorage에서 폰트 설정 복원
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSelectedFont(saved);
      applyFont(saved);
    }
  }, []);

  const applyFont = (fontId: string) => {
    const font = FONT_OPTIONS.find((f) => f.id === fontId);
    if (!font) return;

    // body의 font-family를 직접 변경 (Tailwind V4 @theme은 빌드 시 정적 컴파일됨)
    document.body.style.fontFamily = `var(${font.variable}), system-ui, sans-serif`;
  };

  const handleFontChange = (fontId: string) => {
    setSelectedFont(fontId);
    applyFont(fontId);
    localStorage.setItem(STORAGE_KEY, fontId);
    setOpen(false);
  };

  const currentFont = FONT_OPTIONS.find((f) => f.id === selectedFont);

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            size='icon'
            variant='default'
            className='rounded-full shadow-lg'
          >
            <Type className='size-5' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align='end'
          className='w-72 p-2'
        >
          <div className='mb-2 px-2 py-1.5'>
            <p className='text-sm font-medium'>폰트 선택</p>
            <p className='text-xs text-muted-foreground'>
              현재: {currentFont?.name}
            </p>
          </div>
          <div className='space-y-1'>
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.id}
                onClick={() => handleFontChange(font.id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-md px-2 py-2 text-left transition-colors',
                  'hover:bg-accent',
                  selectedFont === font.id && 'bg-accent'
                )}
              >
                <div
                  className='flex size-8 items-center justify-center rounded-md bg-muted text-sm font-bold'
                  style={{ fontFamily: `var(${font.variable})` }}
                >
                  가
                </div>
                <div className='flex-1 min-w-0'>
                  <p
                    className='text-sm font-medium truncate'
                    style={{ fontFamily: `var(${font.variable})` }}
                  >
                    {font.name}
                  </p>
                  <p className='text-xs text-muted-foreground truncate'>
                    {font.description}
                  </p>
                </div>
                {selectedFont === font.id && (
                  <Check className='size-4 text-primary shrink-0' />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
