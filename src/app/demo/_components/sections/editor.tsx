'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

const Editor = dynamic(() => import('@/shared/ui/editor/editor').then(mod => ({ default: mod.Editor })), {
  ssr: false,
  loading: () => <div className="flex h-[300px] items-center justify-center">에디터 로딩 중...</div>,
});

export function DemoEditor() {
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CKEditor 5 위지윅 에디터</CardTitle>
          <CardDescription>
            CKEditor 5 기반의 강력한 리치 텍스트 에디터입니다. 워드프로세서 수준의 편집 기능,
            이미지 업로드, 고급 테이블 편집, 미디어 임베딩 등 다양한 기능을 제공합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Editor
            content={content}
            onChange={setContent}
            placeholder="게시글 내용을 작성해보세요..."
          />

          <div className="mt-4 flex gap-2">
            <Button onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? '미리보기 숨기기' : 'HTML 미리보기'}
            </Button>
            <Button variant="outline" onClick={() => setContent('')}>
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>HTML 출력</CardTitle>
            <CardDescription>에디터에서 생성된 HTML 코드입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm">
              <code>{content || '내용이 없습니다.'}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>사용 예시</CardTitle>
          <CardDescription>에디터 컴포넌트를 사용하는 방법</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm">
            <code>{`import { Editor } from '@/shared/ui/editor/editor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <Editor
      content={content}
      onChange={setContent}
      placeholder="내용을 입력하세요..."
    />
  );
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>주요 기능</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">텍스트 편집</h3>
              <ul className="list-disc space-y-1 pl-6 text-sm">
                <li>볼드, 이탤릭, 밑줄, 취소선</li>
                <li>위첨자, 아래첨자, 코드</li>
                <li>글꼴 가족, 크기, 색상, 배경색</li>
                <li>텍스트 정렬 (좌/중/우/양쪽)</li>
                <li>포맷 제거</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">구조 요소</h3>
              <ul className="list-disc space-y-1 pl-6 text-sm">
                <li>제목 (H1 ~ H6)</li>
                <li>순서 있는/없는 리스트</li>
                <li>체크리스트 (할 일 목록)</li>
                <li>들여쓰기/내어쓰기</li>
                <li>인용구, 코드 블록</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">미디어 & 삽입</h3>
              <ul className="list-disc space-y-1 pl-6 text-sm">
                <li>이미지: 업로드, URL, 리사이징</li>
                <li>이미지 캡션, 대체 텍스트</li>
                <li>링크 (새 창에서 열기 옵션)</li>
                <li>미디어 임베드 (YouTube 등)</li>
                <li>수평선, 특수문자</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">고급 기능</h3>
              <ul className="list-disc space-y-1 pl-6 text-sm">
                <li>테이블: 행/열 추가, 셀 병합</li>
                <li>테이블 속성, 셀 속성</li>
                <li>찾기 및 바꾸기</li>
                <li>텍스트 하이라이트</li>
                <li>워드 문서 붙여넣기</li>
                <li>실행 취소/다시 실행</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CKEditor 5 vs Tiptap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <p className="mb-2">
              <strong>CKEditor 5:</strong> 완성도 높은 UI가 기본 제공되며, 워드프로세서 수준의
              기능을 즉시 사용할 수 있습니다. 게시판, 블로그, CMS 등에 적합합니다.
            </p>
            <p className="text-muted-foreground">
              <strong>Tiptap:</strong> Headless 에디터로 UI를 직접 개발해야 하지만, 커스터마이징
              자유도가 높습니다. Notion 스타일 에디터나 특수한 요구사항이 있을 때 적합합니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
