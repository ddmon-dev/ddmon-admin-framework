'use client';

import { useCallback, useRef, useState } from 'react';
import { Trash2, File as FileIcon, Plus, RefreshCw } from 'lucide-react';
import { cn } from '@/shared/utils/classnames';
import { toast } from 'sonner';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './input-group';

/**
 * 기존 파일 (서버에 저장된 파일)
 */
export type ExistingFile = {
  type: 'existing';
  url: string;
  name: string;
  markedForDeletion?: boolean;
};

/**
 * 새로 업로드할 파일
 */
export type NewFile = {
  type: 'new';
  file: File;
  replacedFile?: ExistingFile;
};

/**
 * 파일 업로드 값 타입
 */
export type FileUploadValue = ExistingFile | NewFile | null;

interface FileUploadProps {
  value?: FileUploadValue | FileUploadValue[];
  onValueChange?: (value: FileUploadValue | FileUploadValue[]) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  max?: number;
  'aria-invalid'?: boolean;
}

export function FileUpload({
  value,
  onValueChange,
  accept,
  maxSize,
  disabled = false,
  placeholder = '파일을 선택하세요...',
  className,
  multiple = false,
  max,
  'aria-invalid': ariaInvalid,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback(
    (file: File): boolean => {
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
          toast.error(`허용되지 않는 파일 형식입니다. (${accept})`);
          return false;
        }
      }

      if (maxSize && file.size > maxSize) {
        toast.error(`파일 크기는 ${formatFileSize(maxSize)} 이하여야 합니다.`);
        return false;
      }

      return true;
    },
    [accept, maxSize]
  );

  // 단일 파일 모드
  if (!multiple) {
    const singleValue = value as FileUploadValue;

    const handleFile = (file: File) => {
      if (!validateFile(file)) return;

      const replacedFile =
        singleValue?.type === 'existing'
          ? singleValue
          : singleValue?.type === 'new'
            ? singleValue.replacedFile
            : undefined;

      onValueChange?.({
        type: 'new',
        file,
        replacedFile,
      });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      e.target.value = '';
    };

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
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

      if (disabled) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    };

    const handleRemove = () => {
      if (singleValue?.type === 'existing') {
        onValueChange?.({
          ...singleValue,
          markedForDeletion: true,
        });
      } else if (singleValue?.type === 'new') {
        if (singleValue.replacedFile) {
          onValueChange?.(singleValue.replacedFile);
        } else {
          onValueChange?.(null);
        }
      } else {
        onValueChange?.(null);
      }
    };

    const handleRestore = () => {
      if (singleValue?.type === 'existing') {
        onValueChange?.({
          ...singleValue,
          markedForDeletion: false,
        });
      }
    };

    const handleBrowseClick = () => {
      if (!disabled) {
        inputRef.current?.click();
      }
    };

    const hasFile = singleValue && !(singleValue.type === 'existing' && singleValue.markedForDeletion);
    const isMarkedForDeletion = singleValue?.type === 'existing' && singleValue.markedForDeletion;
    const replacedFile = singleValue?.type === 'new' ? singleValue.replacedFile : undefined;

    return (
      <div
        className={cn('w-full', className)}
        data-slot='file-upload'
      >
        <input
          ref={inputRef}
          type='file'
          accept={accept}
          disabled={disabled}
          onChange={handleInputChange}
          className='sr-only'
          aria-invalid={ariaInvalid}
        />

        <InputGroup
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-disabled={disabled}
          className={cn(
            isDragging && 'border-primary ring-primary/50 ring-[3px]',
            disabled && 'opacity-50 cursor-not-allowed'
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
            value={hasFile || isMarkedForDeletion ? getDisplayText(singleValue) : ''}
            placeholder={placeholder}
            readOnly
            onClick={!hasFile ? handleBrowseClick : undefined}
            className={cn(
              'text-sm',
              !hasFile && 'cursor-pointer',
              isMarkedForDeletion && 'line-through text-destructive/70'
            )}
            aria-invalid={ariaInvalid}
            disabled={disabled}
          />
          <InputGroupAddon align='inline-end'>
            {!hasFile && !isMarkedForDeletion && (
              <InputGroupButton
                size='icon-xs'
                variant='default'
                onClick={handleBrowseClick}
                disabled={disabled}
                className='rounded-full'
              >
                <Plus className='h-4 w-4' />
              </InputGroupButton>
            )}
            {hasFile && (
              <div className='flex gap-0.5 -mr-1.5'>
                <InputGroupButton
                  size='icon-xs'
                  variant='default'
                  onClick={handleBrowseClick}
                  disabled={disabled}
                  className='rounded-full'
                >
                  <RefreshCw className='h-3.5! w-3.5!' />
                </InputGroupButton>
                <InputGroupButton
                  size='icon-xs'
                  variant='default'
                  onClick={handleRemove}
                  disabled={disabled}
                  className='rounded-full'
                >
                  <Trash2 className='h-3.5! w-3.5!' />
                </InputGroupButton>
              </div>
            )}
            {isMarkedForDeletion && (
              <div className='flex gap-0.5 -mr-1.5'>
                <InputGroupButton
                  onClick={handleBrowseClick}
                  disabled={disabled}
                  variant='default'
                  className='rounded-full text-xs'
                >
                  새 파일
                </InputGroupButton>
                <InputGroupButton
                  onClick={handleRestore}
                  disabled={disabled}
                  variant='default'
                  className='rounded-full text-xs'
                >
                  삭제 취소
                </InputGroupButton>
              </div>
            )}
          </InputGroupAddon>
        </InputGroup>

        {replacedFile && (
          <p className='mt-1.5 text-xs text-muted-foreground'>
            기존 파일: <span className='line-through'>{truncateFileName(replacedFile.name)}</span>
          </p>
        )}
      </div>
    );
  }

  // 멀티 파일 모드
  const multiValue = (value as FileUploadValue[]) || [];
  const validFiles = multiValue.filter(
    f => f && !(f.type === 'existing' && f.markedForDeletion)
  ) as (ExistingFile | NewFile)[];
  const canAddMore = !max || validFiles.length < max;

  const handleFiles = (files: FileList) => {
    const newFiles: FileUploadValue[] = [...multiValue];
    let addedCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (max && validFiles.length + addedCount >= max) {
        toast.error(`최대 ${max}개까지 업로드 가능합니다.`);
        break;
      }

      const file = files[i];
      if (validateFile(file)) {
        newFiles.push({ type: 'new', file });
        addedCount++;
      }
    }

    if (addedCount > 0) {
      onValueChange?.(newFiles);
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
    const file = multiValue[index];
    if (!file) return;

    if (file.type === 'existing') {
      const newFiles = [...multiValue];
      newFiles[index] = { ...file, markedForDeletion: true };
      onValueChange?.(newFiles);
    } else {
      const newFiles = multiValue.filter((_, i) => i !== index);
      onValueChange?.(newFiles);
    }
  };

  const handleRestoreFile = (index: number) => {
    const file = multiValue[index];
    if (file?.type === 'existing') {
      const newFiles = [...multiValue];
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
      data-slot='file-upload'
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

      {multiValue.length > 0 && (
        <ul className='mt-2 space-y-1'>
          {multiValue.map((file, index) => {
            if (!file) return null;

            const isDeleted = file.type === 'existing' && file.markedForDeletion;
            const fileName =
              file.type === 'existing' ? truncateFileName(file.name) : truncateFileName(file.file.name);
            const fileSize = file.type === 'new' ? formatFileSize(file.file.size) : null;

            return (
              <li
                key={index}
                className={cn(
                  'flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-sm',
                  isDeleted && 'opacity-50'
                )}
              >
                <span className={cn('truncate', isDeleted && 'line-through text-destructive/70')}>
                  {fileName}
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

// 유틸 함수들

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function truncateFileName(fileName: string, maxLength: number = 30): string {
  if (fileName.length <= maxLength) return fileName;

  const lastDotIndex = fileName.lastIndexOf('.');
  const hasExtension = lastDotIndex > 0;

  if (!hasExtension) {
    const halfLength = Math.floor((maxLength - 3) / 2);
    return fileName.slice(0, halfLength) + '...' + fileName.slice(-halfLength);
  }

  const extension = fileName.slice(lastDotIndex);
  const nameWithoutExt = fileName.slice(0, lastDotIndex);

  const availableLength = maxLength - extension.length - 3;
  if (availableLength <= 0) return fileName;

  const halfLength = Math.floor(availableLength / 2);
  return nameWithoutExt.slice(0, halfLength) + '...' + nameWithoutExt.slice(-halfLength) + extension;
}

function getDisplayText(value: FileUploadValue): string {
  if (!value) return '';

  if (value.type === 'existing') {
    if (value.markedForDeletion) {
      return `${truncateFileName(value.name)} (삭제 예정)`;
    }
    return truncateFileName(value.name);
  }

  const fileName = truncateFileName(value.file.name);
  const fileSize = formatFileSize(value.file.size);
  return `${fileName} (${fileSize})`;
}
