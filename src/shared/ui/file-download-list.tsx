'use client';

import { Download } from 'lucide-react';
import { formatFileSize, truncateFileName } from '@/shared/utils/formats';
import { downloadFileFromStorage, type DbFileMetadata } from '@/shared/lib/file-system';

interface FileDownloadListProps {
  files?: DbFileMetadata[] | null;
}

export function FileDownloadList({ files }: FileDownloadListProps) {
  if (!files || files.length === 0) return null;

  return (
    <ul className="space-y-1">
      {files.map((file, index) => (
        <li key={index}>
          <button
            type="button"
            onClick={() => downloadFileFromStorage(file.url, file.originalName)}
            className="group flex w-full items-center justify-between gap-2 rounded-md bg-secondary/70 px-3 py-1.5 text-sm cursor-pointer hover:bg-secondary"
          >
            <span className="truncate group-hover:underline">
              {truncateFileName(file.originalName, 30)}
              <span className="ml-1 text-muted-foreground">({formatFileSize(file.size)})</span>
            </span>
            <Download className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </li>
      ))}
    </ul>
  );
}
