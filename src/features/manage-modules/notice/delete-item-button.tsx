import { DeleteButton } from '../_base/components/delete-button';
import { CONFIG } from './config';

interface DeleteItemButtonProps {
  itemId: string;
}

export function DeleteItemButton({ itemId }: DeleteItemButtonProps) {
  return (
    <DeleteButton
      tableName={CONFIG.tableName}
      itemId={itemId}
    />
  );
}
