'use client';

import { useQueryParams } from '@/shared/hooks/use-query-params';

interface UseDataListParamsOptions {
  defaultSort?: string;
  pageKey?: string;
  sortKey?: string;
  searchKey?: string;
  categoryKey?: string;
}

export function useDataListParams(options?: UseDataListParamsOptions) {
  const queryParams = useQueryParams();

  const pageKey = options?.pageKey || 'page';
  const sortKey = options?.sortKey || 'sort';
  const searchKey = options?.searchKey || 'search';
  const categoryKey = options?.categoryKey || 'category';

  const page = Number(queryParams.get(pageKey)) || 1;
  const sort = queryParams.get(sortKey) || options?.defaultSort || '';
  const search = queryParams.get(searchKey) || '';
  const category = queryParams.get(categoryKey) || '';

  const setPage = (p: number) => queryParams.set(pageKey, String(p));
  const setSort = (s: string) => queryParams.set(sortKey, s);
  const setSearch = (s: string) => queryParams.set({ [searchKey]: s, [pageKey]: '1' });
  const setCategory = (c: string) => queryParams.set(categoryKey, c);

  return { page, sort, search, category, setPage, setSort, setSearch, setCategory };
}
