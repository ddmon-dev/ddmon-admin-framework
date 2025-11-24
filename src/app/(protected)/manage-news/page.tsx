import { type SearchParams } from '@/shared/types/search-params';
import { ManageNews } from '@/features/manage-modules/news';

interface PageProps {
  searchParams: SearchParams;
}

export default function ManageNewsPage({ searchParams }: PageProps) {
  return <ManageNews searchParams={searchParams} />;
}
