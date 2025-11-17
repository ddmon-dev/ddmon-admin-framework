'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { Result } from '@/shared/types/result';
import { Row } from './types';
import { PAGE_SIZE } from './constants';

interface Params {
  page?: string;
  sort?: string;
  search?: string;
  category?: string;
  pageSize?: number;
}

interface ListResult {
  data: Row[];
  totalCount: number;
}

// DB 컬럼명 → Row 타입 매핑
const COLUMN_MAP: Record<string, string> = {
  createdAt: 'created_at',
  viewCount: 'view_count',
};

export async function getList(params: Params): Promise<Result<ListResult>> {
  try {
    const {
      page: rawPage = '1',
      sort = '',
      search = '',
      category = '',
      pageSize = PAGE_SIZE,
    } = params;
    const page = parseInt(rawPage) || 1;

    const supabase = await createClient();

    // 기본 쿼리
    let query = supabase.from('notices').select('*', { count: 'exact' });

    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    // 카테고리 필터
    if (category) {
      query = query.eq('category', category);
    }

    // 정렬
    if (sort) {
      const isDesc = sort.startsWith('-');
      const sortKey = isDesc ? sort.slice(1) : sort;
      const dbColumn = COLUMN_MAP[sortKey] || sortKey;
      query = query.order(dbColumn, { ascending: !isDesc });
    } else {
      // 기본 정렬: 최신순
      query = query.order('created_at', { ascending: false });
    }

    // 페이지네이션
    const startIndex = (page - 1) * pageSize;
    query = query.range(startIndex, startIndex + pageSize - 1);

    // 쿼리 실행
    const { data: rawData, count, error } = await query;

    // 에러 처리
    if (error) {
      return { success: false, error: error.message };
    }

    // snake_case → camelCase 변환
    const data: Row[] = (rawData || []).map(item => ({
      id: item.id,
      title: item.title,
      author: item.author,
      createdAt: item.created_at,
      viewCount: item.view_count,
      category: item.category,
    }));

    return { success: true, data: { data, totalCount: count || 0 } };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: message };
  }
}
