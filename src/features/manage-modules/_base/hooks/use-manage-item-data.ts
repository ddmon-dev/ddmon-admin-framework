'use client';

import { useState, useEffect } from 'react';
import { transformFilesToUploadValues } from '@/shared/lib/file-system';
import type { ActionResult } from '@/shared/types/results';
import type { DbFilesJSONB } from '@/shared/lib/file-system';
import { toast } from 'sonner';
import { useManageSheet } from '../ui/manage-sheet';
import { GENERAL_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';

export type GetItemAction<T> = (params: { id: string }) => Promise<ActionResult<T>>;

/**
 * 공통 날짜 필드 목록 (자동으로 Date 객체로 변환됨)
 */
const DEFAULT_DATE_FIELDS = ['createdAt', 'updatedAt'];

/**
 * 관리 모듈의 항목 데이터를 페칭하고 처리하는 커스텀 훅
 *
 * @param getItemAction - 항목 조회 Server Action
 * @param options - 옵션
 * @param options.additionalDateFields - 추가로 변환할 날짜 필드명 배열 (기본 필드에 추가됨)
 * @returns prevValues, isLoading, error
 *
 * @example
 * // 기본 사용 (createdAt, modifiedAt, updatedAt 자동 변환)
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
          setError(fetchError || CRUD_ERRORS.READ_FAILED());
          return;
        }

        // 변환할 날짜 필드 목록 (기본 + 추가)
        const dateFields = [...DEFAULT_DATE_FIELDS, ...(options?.additionalDateFields || [])];

        // 날짜 필드 변환 (string -> Date)
        // supabase에서 조회한 timestamp field의 데이터는 string 타입으로 넘어오므로, Date 객체로 변환해줌
        const convertedDateFields = Object.fromEntries(
          dateFields
            .filter(field => data[field as keyof typeof data] != null)
            .map(field => [field, new Date(data[field as keyof typeof data] as string)])
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, getItemAction]);

  return { prevValues, isLoading, error };
}
