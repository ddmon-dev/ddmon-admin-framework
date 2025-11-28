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
  const { get, set, remove } = useQueryParams();
  const [value, setValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchValue = get(paramKey);

  React.useEffect(() => {
    setValue(searchValue || '');
  }, [get, paramKey]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      set({ [paramKey]: value.trim(), page: '1' });
    }
  };

  const handleClear = () => {
    setValue('');
    remove(paramKey);
    inputRef.current?.focus();
  };

  return (
    <InputGroup className={cn('w-auto min-w-64', className)}>
      <InputGroupAddon align='inline-start'>
        <Search className='size-4' />
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {value && (
        <InputGroupAddon align='inline-end'>
          <InputGroupButton
            size='icon-xs'
            onClick={handleClear}
            aria-label='검색어 지우기'
          >
            <X className='size-3' />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
