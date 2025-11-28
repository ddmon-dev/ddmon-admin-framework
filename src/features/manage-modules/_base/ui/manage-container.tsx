import { Suspense } from 'react';
import { type SearchParams } from '@/shared/types/search-params';
import { type ActionResult } from '@/shared/types/results';
import { Container } from '@/shared/ui/container';
import { ListSkeleton } from '@/shared/ui/skeletons';
import { type ListProps } from '../config';
import { ManageModuleHeader } from './manage-header';
import { ManageSheetProvider } from './manage-sheet';

interface ManageContainerProps {
  moduleName: string;
  headerAddons?: React.ReactNode;
  children: React.ReactNode;
}

export function ManageContainer({ moduleName, headerAddons, children }: ManageContainerProps) {
  return (
    <ManageSheetProvider>
      <div className='space-y-4'>
        <ManageModuleHeader
          moduleName={moduleName}
          headerAddons={headerAddons}
        />
        <Container className='space-y-4'>
          <h1 className='text-2xl font-bold block md:hidden'>{moduleName} 관리</h1>
          <Suspense fallback={<ListSkeleton />}>{children}</Suspense>
        </Container>
      </div>
    </ManageSheetProvider>
  );
}

interface ManageListFetcherProps<TData> {
  searchParams: SearchParams;
  getList: (params: Record<string, unknown>) => Promise<ActionResult<ListProps<TData>>>;
  children: (props: { data: TData[]; totalCount: number }) => React.ReactNode;
}

export async function ManageListFetcher<TData>({
  searchParams,
  getList,
  children,
}: ManageListFetcherProps<TData>) {
  const params = await searchParams;
  const result = await getList(params);
  const { data, totalCount } = result.data || { data: [], totalCount: 0 };

  return children({ data, totalCount });
}
