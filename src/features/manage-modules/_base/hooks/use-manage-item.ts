'use client';

import { useState, useEffect } from 'react';
import { transformFilesToUploadValues } from '@/shared/lib/file-system';
import type { ActionResult } from '@/shared/types/server-actions';
import type { DbFilesJSONB } from '@/shared/lib/file-system';
import { useManageSheet } from '../components/manage-sheet';

type GetItemAction<T> = (params: { id: string }) => Promise<ActionResult<T>>;

/**
 * 관리 모듈의 항목 데이터를 페칭하고 처리하는 커스텀 훅
 *
 * @param getItemAction - 항목 조회 Server Action
 * @returns prevValues, isLoading, error
 *
 * @example
 * const { prevValues, isLoading, error } = useManageItem(getItem);
 */
export function useManageItem<T extends { files?: DbFilesJSONB }>(getItemAction: GetItemAction<T>) {
  const { manageSheetData } = useManageSheet();
  const { id } = manageSheetData ?? {};

  const [prevValues, setPrevValues] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setPrevValues(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { success, data, error: fetchError } = await getItemAction({ id });

        if (!success) {
          setError(fetchError || '데이터 조회 실패');
          console.error(`데이터 조회 실패: ${fetchError}`);
          return;
        }

        const transformedData = {
          ...data,
          files: transformFilesToUploadValues(data.files),
        } as T;

        setPrevValues(transformedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '예상치 못한 오류';
        setError(errorMessage);
        console.error(errorMessage, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, getItemAction]);

  return { prevValues, isLoading, error };
}
