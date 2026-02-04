import { CONFIG } from './config';
import { CategoryButtonGroup } from '@/shared/ui/data-list';

export function HeaderAddons() {
  return <CategoryButtonGroup options={[...CONFIG.categoryOptions]} />;
}
