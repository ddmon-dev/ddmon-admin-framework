import { type SearchParams } from '@/shared/types/search-params';
import { type ActionResult } from '@/shared/types/results';
import { type ListProps } from '../config';
import { ManageSheetProvider } from './manage-sheet';
import { CreateButton } from './create-button';

interface ManageContainerProps<TData> {
  moduleName: string;
  searchParams: SearchParams;
  getList: (params: Record<string, unknown>) => Promise<ActionResult<ListProps<TData>>>;
  children: (props: { data: TData[]; totalCount: number }) => React.ReactNode;
}

export async function ManageContainer<TData>({
  moduleName,
  searchParams,
  getList,
  children,
}: ManageContainerProps<TData>) {
  const params = await searchParams;
  const result = await getList(params);

  if (!result.success) {
    throw new Error(result.error);
  }

  const { data, totalCount } = result.data;

  return (
    <ManageSheetProvider>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>{moduleName} 관리</h1>
          <CreateButton>{moduleName} 생성</CreateButton>
        </div>
        {children({ data, totalCount })}
      </div>
    </ManageSheetProvider>
  );
}
