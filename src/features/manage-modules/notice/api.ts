'use server';

import { mockData } from '@/mocks/notice';
import { Row } from './types';
import { PAGE_SIZE } from './constants';

interface Params {
  page?: string;
  sort?: string;
  search?: string;
  category?: string;
  pageSize?: number;
}

interface Result {
  data: Row[];
  totalCount: number;
}

export async function getList(params: Params): Promise<Result> {
  const { page: rawPage = '1', sort = '', search = '', category = '', pageSize = PAGE_SIZE } = params;
  const page = parseInt(rawPage) || 1;

  let result = mockData;

  // 검색 필터
  if (search) {
    result = result.filter(
      notice =>
        notice.title.toLowerCase().includes(search.toLowerCase()) ||
        notice.author.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 카테고리 필터
  if (category) {
    result = result.filter(notice => notice.category === category);
  }

  // 정렬
  if (sort) {
    const isDesc = sort.startsWith('-');
    const sortKey = isDesc ? sort.slice(1) : sort;

    result = [...result].sort((a, b) => {
      const aValue = a[sortKey as keyof Row];
      const bValue = b[sortKey as keyof Row];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return isDesc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return isDesc ? bValue - aValue : aValue - bValue;
      }
      return 0;
    });
  }

  const totalCount = result.length;

  // 페이지네이션
  const startIndex = (page - 1) * pageSize;
  const pagedData = result.slice(startIndex, startIndex + pageSize);

  return { data: pagedData, totalCount };
}
