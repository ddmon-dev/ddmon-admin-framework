import { type SearchParams } from '@/shared/types/search-params';
import { ManageFAQ } from '@/features/manage-modules/faq';

interface PageProps {
  searchParams: SearchParams;
}

export default function FAQPage({ searchParams }: PageProps) {
  return <ManageFAQ searchParams={searchParams} />;
}
