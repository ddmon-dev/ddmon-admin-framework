'use client';

import { ManageSheet } from '../../_base/ui';
import { CONFIG } from './config';
import { InquiryDetailView } from './inquiry-detail-view';
import { getItem } from './actions/get-item';

// 더미 폼 컴포넌트 (viewComponent만 사용하지만 formComponent는 필수)
function DummyForm() {
  return null;
}

export function ItemSheet() {
  return (
    <ManageSheet
      fetchFn={getItem}
      formComponent={DummyForm}
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
