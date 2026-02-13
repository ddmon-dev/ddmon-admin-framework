'use client';

import { usePathname } from 'next/navigation';
import { Eye, SquarePen, Copy, Trash2 } from 'lucide-react';
import { useDialog } from '@/shared/ui/app-dialog';
import type { TableName } from '@/shared/lib/supabase/db-helpers';
import { useManageSheet } from './manage-sheet';
import { RowActionMenu, type RowActionItem } from './row-action-menu';
import { RowActionButtons } from './row-action-buttons';
import { confirmDelete } from './delete-button';
import { softDelete } from '../actions';

import type { ManageAction } from '../types';
type ActionName = Exclude<ManageAction, 'create'>;

interface ActionConfig {
  action: ActionName;
  label?: string;
  onClick?: (() => void) | null;
}

type ActionItemConfig = ActionName | ActionConfig;

interface RowActionsProps {
  type: 'menu' | 'buttons';
  id: string;
  tableName: TableName;
  actions: ActionItemConfig[];
}

const DEFAULTS: Record<
  ActionName,
  { label: string; icon: React.ReactNode; variant?: 'destructive' }
> = {
  view: { label: '상세보기', icon: <Eye /> },
  modify: { label: '수정', icon: <SquarePen /> },
  clone: { label: '복제', icon: <Copy /> },
  delete: { label: '삭제', icon: <Trash2 />, variant: 'destructive' },
};

export function RowActions({ type, id, tableName, actions }: RowActionsProps) {
  const manageSheet = useManageSheet();
  const dialog = useDialog();
  const pathname = usePathname();

  const items: RowActionItem[] = actions.map((action) => {
    const config: ActionConfig = typeof action === 'string' ? { action } : action;
    const defaults = DEFAULTS[config.action];

    const onClick =
      config.onClick ??
      (config.action === 'delete'
        ? () =>
            confirmDelete(dialog, {
              deleteFn: () => softDelete({ tableName, id, pathname }),
            })
        : () =>
            manageSheet.open({
              id,
              mode: config.action as Exclude<ActionName, 'delete'>,
            }));

    return {
      label: config.label ?? defaults.label,
      icon: defaults.icon,
      variant: defaults.variant,
      onClick,
    };
  });

  if (type === 'menu') return <RowActionMenu items={items} />;
  return <RowActionButtons items={items} />;
}
