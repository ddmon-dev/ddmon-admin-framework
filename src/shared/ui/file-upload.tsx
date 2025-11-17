'use client';

import { useRef, useState } from 'react';
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
  value?: FileUploadValue;
  onValueChange?: (value: FileUploadValue) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
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
  'aria-invalid': ariaInvalid,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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
        toast.error(`허용되지 않는 파일 형식입니다. (${accept})`);
        return false;
      }
    }

    if (maxSize && file.size > maxSize) {
      toast.error(`파일 크기는 ${formatFileSize(maxSize)} 이하여야 합니다.`);
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;

    const replacedFile =
      value?.type === 'existing' ? value : value?.type === 'new' ? value.replacedFile : undefined;

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
    if (value?.type === 'existing') {
      onValueChange?.({
        ...value,
        markedForDeletion: true,
      });
    } else if (value?.type === 'new') {
      if (value.replacedFile) {
        onValueChange?.(value.replacedFile);
      } else {
        onValueChange?.(null);
      }
    } else {
      onValueChange?.(null);
    }
  };

  const handleRestore = () => {
    if (value?.type === 'existing') {
      onValueChange?.({
        ...value,
        markedForDeletion: false,
      });
    }
  };

  const handleBrowseClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const hasFile = value && !(value.type === 'existing' && value.markedForDeletion);
  const isMarkedForDeletion = value?.type === 'existing' && value.markedForDeletion;
  const replacedFile = value?.type === 'new' ? value.replacedFile : undefined;

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
          value={hasFile || isMarkedForDeletion ? getDisplayText(value) : ''}
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

// 유틸 함수들 (export하여 MultiFileUpload에서도 사용)

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function truncateFileName(fileName: string, maxLength: number = 30): string {
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
