import { createGetListAction } from '../../_base/actions/get-list-factory';
import { CONFIG, type ItemDTO } from '../config';

export const getList = createGetListAction<ItemDTO>({
  tableName: CONFIG.tableName,
  searchFields: ['name', 'id'],
  auth: { requireSuper: true },
  selectColumns: 'id, name, email, super_admin, created_at, updated_at, deleted',
});
