import { format } from 'date-fns';
import { Badge } from '@/shared/ui/badge';
import { FileDownloadList } from '@/shared/ui/file-download-list';
import { RichTextContent } from '@/shared/ui/editor/rich-text-content';
import { SheetFooter, SheetBody, SheetContainer } from '@/shared/ui/sheet';
import {
  DetailField,
  DetailGroup,
  DetailRow,
  ManageSheetClose,
  ManageSheetModeChange,
} from '../_base/ui';
import { CONFIG, type ItemDTO } from './config';

export function DetailView({ data }: { data: ItemDTO }) {
  const categoryLabel = CONFIG.categoryOptions.find(
    (option) => option.value === data.category
  )?.label;

  return (
    <>
      <SheetBody>
        <SheetContainer>
          <DetailGroup>
            <DetailField
              label="카테고리"
              labelClassName="items-center"
              value={
                <Badge variant={data.category === 'notice' ? 'default' : 'secondary'}>
                  {categoryLabel}
                </Badge>
              }
            />
            <DetailField label="제목" value={data.title} />
            <DetailRow>
              <DetailField label="작성자" value={data.author} />
              <DetailField
                label="조회수"
                labelClassName="items-center"
                value={data.view_count?.toLocaleString()}
              />
            </DetailRow>
            <DetailField label="작성일" value={format(data.created_at, 'yyyy-MM-dd HH:mm:ss')} />
            <DetailField label="수정일" value={format(data.updated_at, 'yyyy-MM-dd HH:mm:ss')} />

            <DetailField label="내용" value={<RichTextContent>{data.content}</RichTextContent>} />
            <DetailField
              label="첨부 파일"
              value={<FileDownloadList files={data.files?.attachments} />}
            />
            <DetailField label="썸네일" value={<FileDownloadList files={data.files?.thumbnail} />} />
          </DetailGroup>
        </SheetContainer>
      </SheetBody>
      <SheetFooter>
        <ManageSheetClose />
        <ManageSheetModeChange mode="modify" />
      </SheetFooter>
    </>
  );
}
