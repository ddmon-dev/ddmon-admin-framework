import { type SearchParams } from '@/shared/types/search-params';
import ManageModule from '@/features/manage-modules/_templates/inquiries';

interface PageProps {
  searchParams: SearchParams;
}

export default function ManageInquiryPage({ searchParams }: PageProps) {
  return <ManageModule searchParams={searchParams} />;
}
