'use client';

import { useRef, useState } from 'react';
import { Trash2, File as FileIcon, Plus, RefreshCw } from 'lucide-react';
import { cn } from '@/shared/lib/utils/classnames';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './input-group';
import {
  type FileUploadValue,
  type FileAcceptPreset,
  fileAcceptPresets,
  normalizeAccept,
  formatFileSize,
  truncateFileName,
} from './file-upload';

interface MultiFileUploadProps {
  value?: FileUploadValue[];
  onValueChange?: (value: FileUploadValue[]) => void;
  onError?: (message: string | null) => void;
  accept?: string;
  acceptPreset?: FileAcceptPreset;
  /** 최대 파일 크기 (MB 단위) */
  maxSize?: number;
  max?: number;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  'aria-invalid'?: boolean;
}

export function MultiFileUpload({
  value = [],
  onValueChange,
  onError,
  accept: acceptProp,
  acceptPreset,
  maxSize: maxSizeMB,
  max,
  disabled = false,
  placeholder = '파일을 선택하세요...',
  className,
  'aria-invalid': ariaInvalid,
}: MultiFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const rawAccept = acceptPreset ? fileAcceptPresets[acceptPreset] : acceptProp;
  const accept = rawAccept ? normalizeAccept(rawAccept) : undefined;
  const maxSize = maxSizeMB ? maxSizeMB * 1024 * 1024 : undefined;

  const validFiles = value.filter(f => f && !(f.type === 'existing' && f.markedForDeletion));
  const canAddMore = !max || validFiles.length < max;

  const validateFile = (file: File): boolean => {
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const isValid = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        } else if (type.endsWith('/*')) {
          const baseType = type.slice(0, -2);
          return file.type.startsWith(baseType);
        } else {
          return file.type === type;
        }
      });

      if (!isValid) {
        onError?.(`허용되지 않는 파일 형식입니다. (${accept})`);
        return false;
      }
    }

    if (maxSize && file.size > maxSize) {
      onError?.(`파일 크기는 ${formatFileSize(maxSize)} 이하여야 합니다.`);
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList) => {
    const newFiles: FileUploadValue[] = [...value];
    let addedCount = 0;
    let hasError = false;

    for (let i = 0; i < files.length; i++) {
      if (max && validFiles.length + addedCount >= max) {
        onError?.(`최대 ${max}개까지 업로드 가능합니다.`);
        hasError = true;
        break;
      }

      const file = files[i];
      if (validateFile(file)) {
        newFiles.push({ type: 'new', file });
        addedCount++;
      } else {
        hasError = true;
      }
    }

    if (addedCount > 0) {
      onValueChange?.(newFiles);
      if (!hasError) {
        onError?.(null);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && canAddMore) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || !canAddMore) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const file = value[index];
    if (!file) return;

    if (file.type === 'existing') {
      const newFiles = [...value];
      newFiles[index] = { ...file, markedForDeletion: true };
      onValueChange?.(newFiles);
    } else {
      const newFiles = value.filter((_, i) => i !== index);
      onValueChange?.(newFiles);
    }
  };

  const handleRestoreFile = (index: number) => {
    const file = value[index];
    if (file?.type === 'existing') {
      const newFiles = [...value];
      newFiles[index] = { ...file, markedForDeletion: false };
      onValueChange?.(newFiles);
    }
  };

  const handleBrowseClick = () => {
    if (!disabled && canAddMore) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      className={cn('w-full', className)}
      data-slot='multi-file-upload'
    >
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        disabled={disabled}
        onChange={handleInputChange}
        className='sr-only'
        aria-invalid={ariaInvalid}
        multiple
      />

      <InputGroup
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-disabled={disabled}
        className={cn(
          isDragging && 'border-primary ring-primary/50 ring-[3px]',
          disabled && 'opacity-50 cursor-not-allowed',
          !canAddMore && 'opacity-50'
        )}
      >
        <InputGroupAddon
          align='inline-start'
          className='pl-1.5'
        >
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-secondary'>
            <FileIcon className='h-3.5 w-3.5' />
          </div>
        </InputGroupAddon>
        <InputGroupInput
          value=''
          placeholder={canAddMore ? placeholder : '최대 파일 개수에 도달했습니다'}
          readOnly
          onClick={canAddMore ? handleBrowseClick : undefined}
          className={cn('text-sm', canAddMore && 'cursor-pointer')}
          aria-invalid={ariaInvalid}
          disabled={disabled || !canAddMore}
        />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton
            size='icon-xs'
            variant='default'
            onClick={handleBrowseClick}
            disabled={disabled || !canAddMore}
            className='rounded-full'
          >
            <Plus className='h-4 w-4' />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {value.length > 0 && (
        <ul className='mt-2 space-y-1'>
          {value.map((file, index) => {
            if (!file) return null;

            const isExisting = file.type === 'existing';
            const isDeleted = isExisting && file.markedForDeletion;
            const fileName = isExisting
              ? truncateFileName(file.originalName)
              : truncateFileName(file.file.name);
            const fileSize = isExisting ? null : formatFileSize(file.file.size);

            return (
              <li
                key={index}
                className={cn(
                  'flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-sm',
                  isDeleted && 'opacity-50'
                )}
              >
                <span className='truncate'>
                  {isExisting && <span className='mr-1'>(기존 파일)</span>}
                  <span className={isDeleted ? 'line-through text-destructive/70' : ''}>
                    {fileName}
                  </span>
                  {fileSize && <span className='ml-1 text-muted-foreground'>({fileSize})</span>}
                  {isDeleted && <span className='ml-1 text-destructive'>(삭제 예정)</span>}
                </span>
                <div className='flex gap-0.5 ml-2'>
                  {isDeleted ? (
                    <InputGroupButton
                      size='icon-xs'
                      variant='ghost'
                      onClick={() => handleRestoreFile(index)}
                      disabled={disabled}
                      className='h-5 w-5'
                    >
                      <RefreshCw className='h-3 w-3' />
                    </InputGroupButton>
                  ) : (
                    <InputGroupButton
                      size='icon-xs'
                      variant='ghost'
                      onClick={() => handleRemoveFile(index)}
                      disabled={disabled}
                      className='h-5 w-5'
                    >
                      <Trash2 className='h-3 w-3' />
                    </InputGroupButton>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
