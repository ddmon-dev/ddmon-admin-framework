'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { LoadingButton } from '@/shared/ui/loading-button';
import { Spinner } from '@/shared/ui/spinner';
import { Button } from '@/shared/ui/button';
import { type ConfirmDialogData, type AlertDialogData } from './types';

// Confirm Dialog Component
export interface ConfirmDialogComponentProps {
  data: ConfirmDialogData;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
}

export function ConfirmDialogComponent({ data, onConfirm, onCancel }: ConfirmDialogComponentProps) {
  const {
    title,
    description,
    confirmText = '확인',
    cancelText = '취소',
    variant = 'default',
  } = data;
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  const handleCancel = async () => {
    setIsLoading(true);
    await onCancel();
    setIsLoading(false);
  };

  return (
    <AlertDialog
      open
      onOpenChange={open => !open && !isLoading && handleCancel()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant='outline'
            onClick={handleCancel}
            className='min-w-18'
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <LoadingButton
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            isLoading={isLoading}
            className='min-w-18'
          >
            {confirmText}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Alert Dialog Component
export interface AlertDialogComponentProps {
  data: AlertDialogData;
  onClose: () => void | Promise<void>;
}

const VARIANT_CONFIG = {
  success: {
    icon: CheckCircle2,
    iconClassName: 'h-5 w-5 text-success',
  },
  error: {
    icon: XCircle,
    iconClassName: 'h-5 w-5 text-destructive',
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: 'h-5 w-5 text-warning',
  },
  default: {
    icon: Info,
    iconClassName: 'h-5 w-5 text-info',
  },
} as const;

export function AlertDialogComponent({ data, onClose }: AlertDialogComponentProps) {
  const { title, description, confirmText = '확인', variant = 'default' } = data;
  const variantConfig = VARIANT_CONFIG[variant];
  const Icon = variantConfig.icon;
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = async () => {
    setIsLoading(true);
    await onClose();
    setIsLoading(false);
  };

  return (
    <Dialog
      open
      onOpenChange={open => !open && !isLoading && handleClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Icon className={variantConfig.iconClassName} />
            <span>{title}</span>
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className='flex justify-end'>
          <LoadingButton
            onClick={handleClose}
            isLoading={isLoading}
          >
            {isLoading ? <Spinner /> : confirmText}
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
