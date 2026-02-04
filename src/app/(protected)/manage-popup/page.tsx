import { type SearchParams } from '@/shared/types/search-params';
import ManageModule from '@/features/manage-modules/_templates/popup';

interface PageProps {
  searchParams: SearchParams;
}

export default function ManagePopupPage({ searchParams }: PageProps) {
  return <ManageModule searchParams={searchParams} />;
}
