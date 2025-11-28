import { cn } from '@/shared/utils/classnames';
import { Button } from '@/shared/ui/button';
import { LoadingButton } from '@/shared/ui/loading-button';
import { useManageSheet } from './manage-sheet';

interface ManageFormSubmitProps {
  isLoading: boolean;
  className?: string;
}

export function ManageFormSubmit({ isLoading, className }: ManageFormSubmitProps) {
  return (
    <LoadingButton
      type='submit'
      isLoading={isLoading}
      className={cn('font-bold', className)}
    >
      저장하기
    </LoadingButton>
  );
}

interface ManageFormCancelProps {
  className?: string;
}

export function ManageFormCancel({ className }: ManageFormCancelProps) {
  const manageSheet = useManageSheet();
  return (
    <LoadingButton
      variant='outline'
      onClick={() => manageSheet.close()}
      className={cn('font-bold', className)}
    >
      취소하기
    </LoadingButton>
  );
}
