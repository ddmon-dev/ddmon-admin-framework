'use client';

import { ManageSheet } from '../_base/ui';
import { CONFIG } from './config';
import { InquiryDetailView } from './inquiry-detail-view';
import { getItem } from './actions/get-item';

export function ItemSheet() {
  return (
    <ManageSheet
      fetchFn={getItem}
      viewComponent={InquiryDetailView}
      moduleName={CONFIG.moduleName}
      customVariant={{
        view: {
          title: () => '문의 상세',
          description: '문의 내용을 확인하고 답변을 작성하세요.',
        },
      }}
    />
  );
}
