import { cn } from '@/shared/utils/classnames';
import { Button } from '@/shared/ui/button';
import { LoadingButton } from '@/shared/ui/loading-button';
import { useManageSheet } from './manage-sheet';

interface ManageFormSubmitProps {
  isLoading: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ManageFormSubmit({
  isLoading,
  className,
  children = '저장하기',
}: ManageFormSubmitProps) {
  return (
    <LoadingButton
      type='submit'
      isLoading={isLoading}
      className={cn('font-semibold', className)}
    >
      {children}
    </LoadingButton>
  );
}

interface ManageSheetCloseProps {
  children?: React.ReactNode;
  className?: string;
}

export function ManageSheetClose({ children = '취소하기', className }: ManageSheetCloseProps) {
  const manageSheet = useManageSheet();
  return (
    <Button
      type='button'
      variant='secondary'
      onClick={() => manageSheet.close()}
      className={cn('font-semibold', className)}
    >
      {children}
    </Button>
  );
}
