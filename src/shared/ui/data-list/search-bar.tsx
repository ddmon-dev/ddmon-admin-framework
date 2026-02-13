'use client';

import * as React from 'react';
import { cn } from '@/shared/utils/classnames';
import { Search, X } from 'lucide-react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/input-group';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { useIsMobile } from '@/shared/hooks';

interface SearchBarProps {
  paramKey?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  paramKey = 'search',
  placeholder = '검색어를 입력하세요.',
  className,
  autoFocus = false,
}: SearchBarProps) {
  const isMobile = useIsMobile();
  const { get, set } = useQueryParams();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // URL을 source of truth로 사용
  const searchValue = get(paramKey) || '';
  const [value, setValue] = React.useState(searchValue);

  // URL 변경 시 로컬 상태 동기화 (외부에서 URL이 변경된 경우)
  React.useEffect(() => {
    setValue(searchValue);
  }, [searchValue]);

  const handleSubmit = (newValue: string) => {
    const trimmed = newValue.trim();
    if (trimmed) {
      set({ [paramKey]: trimmed, page: '1' });
    } else {
      set({ [paramKey]: '', page: '1' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(value);
      isMobile && inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    handleSubmit('');
    inputRef.current?.focus();
  };

  return (
    <InputGroup className={cn('w-auto min-w-64', className)}>
      <InputGroupAddon align="inline-start">
        <Search className="size-4" />
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" onClick={handleClear} aria-label="검색어 지우기">
            <X className="size-3" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
