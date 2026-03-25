import { Suspense } from 'react';
import { type SearchParams } from '@/shared/types/search-params';
import { type ActionResult } from '@/shared/types/results';
import { Container } from '@/shared/ui/container';
import { ListSkeleton } from '@/shared/ui/skeletons';
import { type ListProps } from '../types';
import { ManageModuleHeader } from './manage-header';
import { ManageSheetProvider } from './manage-sheet';

interface ManageContainerProps {
  title?: string;
  moduleName: string;
  headerAddons?: React.ReactNode;
  headerSearchBar?: React.ReactNode;
  createButtonLabel?: string;
  hideCreateButton?: boolean;
  showLangFilter?: boolean;
  children: React.ReactNode;
}

export function ManageContainer({
  title,
  moduleName,
  headerAddons,
  headerSearchBar,
  createButtonLabel,
  hideCreateButton,
  showLangFilter,
  children,
}: ManageContainerProps) {
  return (
    <ManageSheetProvider>
      <div className="flex flex-col gap-4 flex-1">
        <ManageModuleHeader
          title={title}
          moduleName={moduleName}
          headerAddons={headerAddons}
          headerSearchBar={headerSearchBar}
          createButtonLabel={createButtonLabel}
          hideCreateButton={hideCreateButton}
          showLangFilter={showLangFilter}
        />
        <Container className="flex flex-col gap-8 md:gap-4 flex-1 mt-8 md:mt-4">
          <h1 className="text-2xl font-bold block md:hidden text-center md:text-left">
            {title ? title : `${moduleName} 관리`}
          </h1>
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
