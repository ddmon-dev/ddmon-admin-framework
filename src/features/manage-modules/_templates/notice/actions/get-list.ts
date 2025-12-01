import { createGetListAction } from '../../../_base/actions/get-list-factory';
import { CONFIG, type ItemDTO } from '../config';

export const getList = createGetListAction<ItemDTO>({
  tableName: CONFIG.tableName,
  searchFields: ['title', 'author'],
});
