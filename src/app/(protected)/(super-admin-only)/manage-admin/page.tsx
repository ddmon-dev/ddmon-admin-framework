import { type SearchParams } from '@/shared/types/search-params';
import ManageModule from '@/features/manage-modules/admin';

interface PageProps {
  searchParams: SearchParams;
}

export default function ManageModulePage({ searchParams }: PageProps) {
  return <ManageModule searchParams={searchParams} />;
}
