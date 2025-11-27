import { createGetListAction } from '../../_base/actions/create-get-list-action';
import { CONFIG, type ItemDTO } from '../config';

export const getList = createGetListAction<ItemDTO>({
  tableName: CONFIG.tableName,
  searchFields: ['question', 'answer'],
});
