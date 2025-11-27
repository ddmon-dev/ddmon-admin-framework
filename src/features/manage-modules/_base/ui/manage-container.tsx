import { type SearchParams } from '@/shared/types/search-params';
import { type ActionResult } from '@/shared/types/results';
import { Container } from '@/shared/ui/container';
import { type ListProps } from '../config';
import { ManageModuleHeader } from './manage-header';
import { ManageSheetProvider } from './manage-sheet';

interface ManageContainerProps<TData> {
  moduleName: string;
  searchParams: SearchParams;
  getList: (params: Record<string, unknown>) => Promise<ActionResult<ListProps<TData>>>;
  children: (props: { data: TData[]; totalCount: number }) => React.ReactNode;
  headerAddons?: React.ReactNode;
}

export async function ManageContainer<TData>({
  moduleName,
  searchParams,
  getList,
  children,
  headerAddons,
}: ManageContainerProps<TData>) {
  const params = await searchParams;
  const result = await getList(params);

  if (!result.success) {
    throw new Error(result.error);
  }

  const { data, totalCount } = result.data;

  return (
    <ManageSheetProvider>
      <ManageModuleHeader
        moduleName={moduleName}
        headerAddons={headerAddons}
      />
      <Container className='space-y-4'>
        <h1 className='text-2xl font-bold block md:hidden'>{moduleName} 관리</h1>
        {children({ data, totalCount })}
      </Container>
    </ManageSheetProvider>
  );
}
