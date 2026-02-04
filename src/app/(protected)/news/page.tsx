import { type SearchParams } from '@/shared/types/search-params';
import ManageModule from '@/features/manage-modules/news';

interface PageProps {
  searchParams: SearchParams;
}

export default function ManageNewsPage({ searchParams }: PageProps) {
  return <ManageModule searchParams={searchParams} />;
}
