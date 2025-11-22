'use client';

import { useState, useEffect } from 'react';
import { ManageSheet, useManageSheet } from '../_base/components/manage-sheet';
import { ItemForm } from './item-form';
import { getItem } from './actions/get-item';
import { type ItemDTO } from './types';
import { type FileMetadata } from '@/shared/lib/file-system';

export function ItemSheet() {
  const { manageSheetData } = useManageSheet();
  const { id, mode } = manageSheetData ?? { id: '' };
  const [prevValues, setPrevValues] = useState<ItemDTO | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;

      const { success, data, error } = await getItem({ id });

      if (!success) {
        console.error(`Data fetch error: ${error}`);
        return;
      }

      console.log(data.files);

      // FileMetadata를 FormFileUpload 형태로 변환
      const transformedData = {
        ...data,
        files: data.files
          ? Object.fromEntries(
              Object.entries(data.files as Record<string, FileMetadata[]>).map(
                ([category, fileList]) => [
                  category,
                  fileList?.map((file) => ({
                    type: 'existing' as const,
                    url: file.url,
                    originalName: file.originalName,
                    size: file.size,
                    mimeType: file.mimeType,
                    uploadedAt: file.uploadedAt,
                  })),
                ]
              )
            )
          : undefined,
      };

      setPrevValues(transformedData as ItemDTO);
    };

    fetchItem();

    if (!id) {
      setPrevValues(null);
    }
  }, [id]);

  return (
    <ManageSheet>
      {mode === 'view' ? null : (
        <ItemForm
          id={id || undefined}
          prevValues={prevValues}
        />
      )}
    </ManageSheet>
  );
}
