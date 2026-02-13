'use client';

import { useQueryParams } from '@/shared/hooks';
import { FileText, Search } from 'lucide-react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyContent,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/empty';
import { SearchBar } from './search-bar';

const emptyMessages = {
  default: {
    icon: <FileText />,
    title: 'No Contents Yet',
    description: '아직 생성된 데이터가 없습니다.',
    action: null,
  },
  search: {
    icon: <Search />,
    title: 'No Results Found',
    description: '검색 결과가 없습니다. 다른 검색어를 시도해주세요.',
    action: <SearchBar autoFocus />,
  },
};

export function ListEmpty() {
  const queryParams = useQueryParams();
  const search = queryParams.get('search');

  const message = search ? emptyMessages.search : emptyMessages.default;

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">{message.icon}</EmptyMedia>
        <EmptyTitle>{message.title}</EmptyTitle>
        <EmptyDescription>{message.description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{message.action}</EmptyContent>
    </Empty>
  );
}
