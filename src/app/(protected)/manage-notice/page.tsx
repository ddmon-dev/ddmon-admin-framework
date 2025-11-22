import { type SearchParams } from '@/shared/types/search-params';
import { ManageNotice } from '@/features/manage-modules/notice';

interface PageProps {
  searchParams: SearchParams;
}

export default function ManageNoticePage({ searchParams }: PageProps) {
  return <ManageNotice searchParams={searchParams} />;
}
