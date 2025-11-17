'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface UseQueryStringReturn {
  searchParams: URLSearchParams;
  createURLSearchParams: () => URLSearchParams;
  get(key: string): string | null;
  getValues(): Record<string, string>;
  getValues(...keys: string[]): Record<string, string | null>;
  set(key: string, value: string, options?: NavigateOptions): void;
  set(params: Record<string, string>, options?: NavigateOptions): void;
  remove(keys: string | string[], options?: NavigateOptions): void;
  clear(options?: NavigateOptions): void;
  has(key: string): boolean;
  createQueryString(paramsToSet?: Record<string, string | number> | null, anchor?: string): string;
}

export function useQueryParams(): UseQueryStringReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createURLSearchParams = () => new URLSearchParams(searchParams);

  const navigate = (params: URLSearchParams, options?: NavigateOptions) => {
    const path = `${pathname}?${params.toString()}`;
    router.push(path, options);
  };

  function get(key: string): string | null {
    return createURLSearchParams().get(key);
  }

  function getValues(): Record<string, string>;
  function getValues(...keys: string[]): Record<string, string | null>;
  function getValues(...keys: string[]): Record<string, string | null> {
    const params = createURLSearchParams();

    if (keys.length === 0) {
      const result: Record<string, string> = {};
      params.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    }

    const result: Record<string, string | null> = {};
    keys.forEach(key => {
      result[key] = params.get(key);
    });
    return result;
  }

  function set(key: string, value: string, options?: NavigateOptions): void;
  function set(params: Record<string, string>, options?: NavigateOptions): void;
  function set(
    ...args: [string, string, NavigateOptions?] | [Record<string, string>, NavigateOptions?]
  ): void {
    if (typeof args[0] === 'string') {
      // 단일 키-값 설정
      const [key, value, options] = args as [string, string, NavigateOptions?];
      const params = createURLSearchParams();
      params.set(key, value);
      navigate(params, options);
    } else {
      // 여러 키-값 설정
      const [paramsToSet, options] = args as [Record<string, string>, NavigateOptions?];
      const params = createURLSearchParams();
      Object.entries(paramsToSet).forEach(([key, value]) => {
        params.set(key, value);
      });
      navigate(params, options);
    }
  }

  function remove(keys: string | string[], options?: NavigateOptions): void {
    const params = createURLSearchParams();

    if (typeof keys === 'string') {
      params.delete(keys);
    } else if (Array.isArray(keys)) {
      keys.forEach(key => {
        params.delete(key);
      });
    }

    navigate(params, options);
  }

  function clear(options?: NavigateOptions): void {
    router.push(pathname, options);
  }

  function has(key: string): boolean {
    return createURLSearchParams().has(key);
  }

  function createQueryString(
    paramsToSet?: Record<string, string | number> | null,
    anchor?: string
  ): string {
    const params = createURLSearchParams();

    if (paramsToSet) {
      Object.entries(paramsToSet).forEach(([key, value]) => {
        params.set(key, value.toString());
      });
    }

    let queryString = params.toString() ? `?${params.toString()}` : '';

    if (anchor) {
      queryString += `#${anchor}`;
    }

    return queryString;
  }

  return {
    searchParams,
    createURLSearchParams,
    get,
    getValues,
    set,
    remove,
    clear,
    has,
    createQueryString,
  };
}
