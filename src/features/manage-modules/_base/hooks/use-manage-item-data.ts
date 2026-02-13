'use client';

import { useState, useEffect } from 'react';
import { transformFilesToUploadValues } from '@/shared/lib/file-system';
import type { ActionResult } from '@/shared/types/results';
import type { DbFilesJSONB } from '@/shared/lib/file-system';
import { useManageSheet } from '../ui/manage-sheet';
import { GENERAL_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { atLeast } from '@/shared/utils/delays';
import { APP_CONFIG } from '@/app.config';

export type GetItemAction<T> = (params: { id: string }) => Promise<ActionResult<T>>;

/**
 * 공통 날짜 필드 목록 (자동으로 Date 객체로 변환됨)
 */
const DEFAULT_DATE_FIELDS = ['created_at', 'updated_at'];

/**
 * 관리 모듈의 항목 데이터를 페칭하고 처리하는 커스텀 훅
 *
 * @param getItemAction - 항목 조회 Server Action
 * @param options - 옵션
 * @param options.additionalDateFields - 추가로 변환할 날짜 필드명 배열 (기본 필드에 추가됨)
 * @returns prevValues, isLoading, error
 *
 * @example
 * // 기본 사용 (created_at, modifiedAt, updated_at 자동 변환)
 * const { prevValues } = useManageItemData(getItem);
 *
 * @example
 * // 커스텀 날짜 필드 추가
 * const { prevValues } = useManageItemData(getItem, {
 *   additionalDateFields: ['publishedAt', 'expiredAt']
 * });
 */
export function useManageItemData<T extends { files?: DbFilesJSONB }>(
  getItemAction: GetItemAction<T>,
  options?: {
    additionalDateFields?: string[];
  }
) {
  const manageSheet = useManageSheet();
  const { id } = manageSheet.data ?? {};

  const [prevValues, setPrevValues] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchItem(targetId: string) {
    try {
      const { success, data, error: fetchError } = await getItemAction({ id: targetId });

      if (!success) {
        setError(fetchError || CRUD_ERRORS.READ_FAILED());
        return;
      }

      const dateFields = [...DEFAULT_DATE_FIELDS, ...(options?.additionalDateFields || [])];

      const convertedDateFields = Object.fromEntries(
        dateFields
          .filter((field) => data[field as keyof typeof data] != null)
          .map((field) => [field, new Date(data[field as keyof typeof data] as string)])
      );

      const transformedData = {
        ...data,
        files: transformFilesToUploadValues(data.files),
        ...convertedDateFields,
      } as T;

      setPrevValues(transformedData);
    } catch (error) {
      setError(error instanceof Error ? error.message : GENERAL_ERRORS.UNEXPECTED);
      console.error(error);
    }
  }

  useEffect(() => {
    if (!id) {
      setPrevValues(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    atLeast(() => fetchItem(id), APP_CONFIG.UX.MIN_LOADING_TIME).then(() => {
      setIsLoading(false);
    });
  }, [id, getItemAction]);

  function refetch() {
    if (id) fetchItem(id);
  }

  return { prevValues, isLoading, error, refetch };
}
