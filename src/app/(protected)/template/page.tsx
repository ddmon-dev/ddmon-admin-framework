import { type SearchParams } from '@/shared/types/search-params';
import { ManageTemplate } from '@/features/manage-modules/_template';

interface PageProps {
  searchParams: SearchParams;
}

export default function TemplatePage({ searchParams }: PageProps) {
  return <ManageTemplate searchParams={searchParams} />;
}
