'use client';

import { useQueryParams } from '@/shared/hooks/use-query-params';

interface UseDataListParamsOptions {
  defaultSort?: string;
  pageKey?: string;
  sortKey?: string;
  searchKey?: string;
}

export function useDataListParams(options?: UseDataListParamsOptions) {
  const queryParams = useQueryParams();

  const pageKey = options?.pageKey || 'page';
  const sortKey = options?.sortKey || 'sort';
  const searchKey = options?.searchKey || 'search';

  const page = Number(queryParams.get(pageKey)) || 1;
  const sort = queryParams.get(sortKey) || options?.defaultSort || '';
  const search = queryParams.get(searchKey) || '';

  const setPage = (p: number) => queryParams.set(pageKey, String(p));
  const setSort = (s: string) => queryParams.set(sortKey, s);
  const setSearch = (s: string) => queryParams.set({ [searchKey]: s, [pageKey]: '1' });

  return { page, sort, search, setPage, setSort, setSearch };
}
