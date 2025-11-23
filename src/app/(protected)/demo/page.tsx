import { type SearchParams } from '@/shared/types/search-params';
import { ManageDemo } from '@/features/manage-modules/demo';

interface PageProps {
  searchParams: SearchParams;
}

export default function DemoPage({ searchParams }: PageProps) {
  return <ManageDemo searchParams={searchParams} />;
}
