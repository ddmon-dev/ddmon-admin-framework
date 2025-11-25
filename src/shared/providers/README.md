# Dialog Provider

전역 다이얼로그 시스템. Promise 기반 명령형 API로 확인/취소 다이얼로그와 알림 다이얼로그를 제공합니다.

## 개요

```typescript
const dialog = useDialog();

// 확인/취소 다이얼로그
const confirmed = await dialog.confirm({
  title: '정말 삭제하시겠습니까?',
  variant: 'destructive'
});

// 알림 다이얼로그
await dialog.alert({
  title: '저장 완료',
  variant: 'success'
});
```

## 특징

- **명령형 API**: `await dialog.confirm()` 형태로 사용
- **Promise 기반**: async/await와 자연스럽게 통합
- **타입 안전**: TypeScript 완전 지원
- **Variant 지원**: success, error, warning, destructive 등
- **아이콘 자동 표시**: variant에 따라 적절한 아이콘 표시

## 설치

이미 `app/layout.tsx`에 설치되어 있습니다.

```tsx
// app/layout.tsx
<DialogProvider>
  {children}
</DialogProvider>
```

## 사용 방법

### 기본 사용

```typescript
import { useDialog } from '@/shared/providers';

function MyComponent() {
  const dialog = useDialog();

  // 컴포넌트에서 사용
}
```

### 1. Confirm Dialog (확인/취소)

사용자 확인이 필요한 작업에 사용합니다.

```typescript
const handleDelete = async (id: string) => {
  const confirmed = await dialog.confirm({
    title: '공지사항 삭제',
    description: '정말 이 공지사항을 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
    variant: 'destructive'
  });

  if (!confirmed) return; // 취소하면 false 반환

  await deleteNotice(id);
  toast.success('삭제되었습니다');
};
```

**Variant:**
- `default`: 일반 확인 (파란색 버튼)
- `destructive`: 위험한 작업 (빨간색 버튼)

### 2. Alert Dialog (알림)

작업 결과나 중요한 정보를 알려줄 때 사용합니다.

```typescript
// 성공 알림
await dialog.alert({
  title: '저장 완료',
  description: '변경사항이 성공적으로 저장되었습니다.',
  variant: 'success'
});

// 에러 알림
await dialog.alert({
  title: '업로드 실패',
  description: '파일 크기가 너무 큽니다. (최대 10MB)',
  variant: 'error'
});

// 경고 알림
await dialog.alert({
  title: '주의',
  description: '이 작업은 시간이 오래 걸릴 수 있습니다.',
  variant: 'warning'
});

// 일반 정보
await dialog.alert({
  title: '안내',
  description: '시스템 점검이 예정되어 있습니다.',
  variant: 'default'
});
```

**Variant:**
- `success`: 초록색 체크 아이콘
- `error`: 빨간색 X 아이콘
- `warning`: 노란색 경고 아이콘
- `default`: 파란색 정보 아이콘

## API Reference

### useDialog()

Dialog 컨텍스트를 반환합니다.

```typescript
const dialog = useDialog();
```

**throws**: DialogProvider 외부에서 사용 시 에러

### dialog.confirm(data)

확인/취소 다이얼로그를 표시합니다. Toast API와 유사한 패턴으로 콜백 기반입니다.

```typescript
interface ConfirmDialogData {
  title: string;                              // 다이얼로그 제목
  description?: string;                       // 설명 (선택)
  confirmText?: string;                       // 확인 버튼 텍스트 (기본: "확인")
  cancelText?: string;                        // 취소 버튼 텍스트 (기본: "취소")
  variant?: 'default' | 'destructive';        // 버튼 스타일
  onConfirm?: () => void | Promise<void>;     // 확인 버튼 클릭 시 실행할 콜백
  onCancel?: () => void | Promise<void>;      // 취소 버튼 클릭 시 실행할 콜백
}

await dialog.confirm(data);
```

**반환값**: `void` (확인 또는 취소 클릭 시 완료)

**사용법**: `onConfirm`, `onCancel` 콜백으로 확인/취소 후 동작을 정의합니다.

### dialog.alert(data)

알림 다이얼로그를 표시합니다.

```typescript
interface AlertDialogData {
  title: string;                                       // 다이얼로그 제목
  description?: string;                                // 설명 (선택)
  confirmText?: string;                                // 확인 버튼 텍스트 (기본: "확인")
  variant?: 'default' | 'success' | 'warning' | 'error'; // 아이콘 스타일
  onConfirm?: () => void | Promise<void>;              // 확인 버튼 클릭 시 실행할 콜백 (선택)
}

await dialog.alert(data);
```

**반환값**: `void` (확인 클릭 시 완료)

**onConfirm 옵션**: 확인 버튼 클릭 시 자동으로 실행할 콜백 함수입니다. 리다이렉트, 새로고침, 데이터 갱신 등 Alert 후 필수적으로 실행되어야 하는 작업에 유용합니다.

### dialog.close()

현재 열린 다이얼로그를 강제로 닫습니다.

```typescript
dialog.close();
```

## 실전 예시

### manage-modules 삭제 확인

```typescript
// src/features/manage-modules/_base/ui/list-row-actions.tsx
import { useDialog } from '@/shared/providers';

export function ListRowActions({ row }: ListRowActionsProps) {
  const dialog = useDialog();

  const handleDelete = async () => {
    await dialog.confirm({
      title: `${CONFIG.itemLabel} 삭제`,
      description: `정말 이 ${CONFIG.itemLabel}을(를) 삭제하시겠습니까?`,
      confirmText: '삭제',
      cancelText: '취소',
      variant: 'destructive',
      onConfirm: async () => {
        const result = await deleteItem(row.original.id);
        if (result.success) {
          toast.success('삭제되었습니다');
        }
      }
    });
  };

  return (
    <DropdownMenuItem onClick={handleDelete}>
      삭제
    </DropdownMenuItem>
  );
}
```

### Server Action 결과 표시

```typescript
// src/features/manage-modules/_base/ui/item-form.tsx
import { useDialog } from '@/shared/providers';

export function ItemForm({ mode, id }: ItemFormProps) {
  const dialog = useDialog();

  const onSubmit = async (values: FormValues) => {
    const result = mode === 'create'
      ? await createItem(values)
      : await updateItem(id, values);

    if (result.success) {
      closeManageSheet();
      await dialog.alert({
        title: mode === 'create' ? '등록 완료' : '수정 완료',
        description: result.message,
        variant: 'success'
      });
    } else {
      await dialog.alert({
        title: '오류 발생',
        description: result.message,
        variant: 'error'
      });
    }
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

### 복잡한 흐름 제어

```typescript
async function handlePublish(id: string) {
  await dialog.confirm({
    title: '공지사항 발행',
    description: '발행하면 모든 사용자에게 표시됩니다.',
    confirmText: '발행',
    variant: 'default',
    onConfirm: async () => {
      // 발행 처리
      const result = await publishNotice(id);

      // 결과 알림
      await dialog.alert({
        title: result.success ? '발행 완료' : '발행 실패',
        description: result.message,
        variant: result.success ? 'success' : 'error',
        onConfirm: () => {
          if (result.success) {
            router.push('/notices');
          }
        }
      });
    }
  });
}
```

### Confirm 사용 예시

Toast API와 유사한 패턴으로 `onConfirm`, `onCancel` 콜백을 사용합니다.

```typescript
// 기본 사용
async function handleDelete(id: string) {
  await dialog.confirm({
    title: '정말 삭제하시겠습니까?',
    variant: 'destructive',
    onConfirm: async () => {
      await deleteItem(id);
      toast.success('삭제되었습니다');
    }
  });
}

// onCancel 추가
async function handleDelete(id: string) {
  await dialog.confirm({
    title: '정말 삭제하시겠습니까?',
    variant: 'destructive',
    onConfirm: async () => {
      await deleteItem(id);
      toast.success('삭제되었습니다');
    },
    onCancel: () => {
      console.log('삭제 취소됨');
    }
  });
}

// 복잡한 워크플로우
async function handlePublish(id: string) {
  await dialog.confirm({
    title: '공지사항 발행',
    description: '발행하면 모든 사용자에게 표시됩니다.',
    confirmText: '발행',
    onConfirm: async () => {
      const result = await publishNotice(id);
      if (result.success) {
        toast.success('발행되었습니다');
        router.push('/notices');
      } else {
        await dialog.alert({
          title: '발행 실패',
          description: result.message,
          variant: 'error'
        });
      }
    }
  });
}
```

### Alert 콜백 활용

Alert 후 필수적으로 실행되어야 하는 작업은 `onConfirm`으로 처리할 수 있습니다.

```typescript
// 세션 만료 → 로그인 페이지
async function handleSessionExpired() {
  await dialog.alert({
    title: '세션이 만료되었습니다',
    description: '다시 로그인해주세요.',
    variant: 'warning',
    onConfirm: () => router.push('/login')
  });
}

// 업데이트 완료 → 새로고침
async function handleUpdateComplete() {
  await dialog.alert({
    title: '설정이 변경되었습니다',
    description: '페이지를 새로고침합니다.',
    variant: 'success',
    onConfirm: () => window.location.reload()
  });
}

// 에러 발생 → 데이터 초기화
async function handleCriticalError() {
  await dialog.alert({
    title: '오류가 발생했습니다',
    description: '데이터를 초기화하고 다시 시도해주세요.',
    variant: 'error',
    onConfirm: async () => {
      await resetData();
      await refetch();
    }
  });
}
```

## Toast vs Alert Dialog

언제 어떤 것을 사용할지 가이드:

| 상황 | 추천 | 이유 |
|------|------|------|
| "저장되었습니다" | Toast | 간단한 피드백, 비침투적 |
| "파일 크기 초과" | Alert Dialog | 상세 설명 필요 |
| 삭제 확인 | Confirm Dialog | 되돌릴 수 없는 작업 |
| 폼 제출 성공 | Toast | 빠른 피드백 |
| 네트워크 에러 | Alert Dialog | 사용자가 반드시 인지해야 함 |
| 여러 단계 작업 | Dialog 조합 | 순차적 흐름 제어 |

**경험 법칙:**
- Toast: 3초 안에 읽을 수 있는 간단한 메시지
- Alert Dialog: 사용자가 반드시 읽고 이해해야 하는 중요한 메시지
- Confirm Dialog: 사용자의 명시적 동의가 필요한 작업

## 패턴

### 1. Early Return 패턴

```typescript
const confirmed = await dialog.confirm({ title: '삭제' });
if (!confirmed) return; // 취소 시 조기 종료

await deleteItem(id);
```

### 2. 결과 기반 Variant

```typescript
await dialog.alert({
  title: result.success ? '성공' : '실패',
  description: result.message,
  variant: result.success ? 'success' : 'error'
});
```

### 3. 연속 다이얼로그

```typescript
// 1단계: 확인
if (!await dialog.confirm({ title: '정말?' })) return;

// 2단계: 처리
const result = await process();

// 3단계: 결과
await dialog.alert({
  title: '완료',
  variant: 'success'
});
```

### 4. 에러 처리와 다이얼로그 제어 (return 패턴)

`onConfirm`, `onCancel`, `onClose`에서 `false`를 반환하면 다이얼로그가 닫히지 않고 유지됩니다.
이를 통해 에러 발생 시 사용자가 다시 시도할 수 있습니다.

```typescript
// 삭제 실패 시 다이얼로그 유지
await dialog.confirm({
  title: '데이터 삭제',
  description: '정말 삭제하시겠습니까?',
  variant: 'destructive',
  onConfirm: async () => {
    try {
      await deleteItem(id);
      toast.success('삭제되었습니다');
      return true; // 또는 return; (생략 가능) - 다이얼로그 닫기
    } catch (error) {
      toast.error('삭제 중 오류가 발생했습니다');
      return false; // 다이얼로그 유지 (재시도 가능)
    }
  }
});

// Validation 실패 시 유지
await dialog.confirm({
  title: '저장하시겠습니까?',
  onConfirm: async () => {
    if (!isValid()) {
      toast.error('입력값을 확인하세요');
      return false; // 다이얼로그 유지
    }

    await saveData();
    toast.success('저장되었습니다');
    return true; // 다이얼로그 닫기
  }
});

// Alert에서도 동일하게 사용 가능
await dialog.alert({
  title: '데이터 동기화',
  description: '서버와 동기화합니다',
  onConfirm: async () => {
    try {
      await syncWithServer();
      return true; // 성공 - 닫기
    } catch (error) {
      toast.error('동기화 실패');
      return false; // 실패 - 유지 (재시도 가능)
    }
  }
});
```

**규칙:**
- `return true` 또는 `return;` (undefined): 다이얼로그 닫기 (기본 동작)
- `return false`: 다이얼로그 유지
- 반환값이 없으면 기본적으로 닫힘

### 5. Toast와 유사한 API 패턴

Confirm과 Alert 모두 콜백 기반으로 Toast API와 일관성 있게 사용합니다.

**Confirm 패턴:**
```typescript
// 확인/취소 후 각각 다른 작업
await dialog.confirm({
  title: '삭제하시겠습니까?',
  onConfirm: async () => {
    await deleteItem(id);
    toast.success('삭제됨');
  },
  onCancel: () => {
    console.log('취소됨');
  }
});

// 간결한 워크플로우
await dialog.confirm({
  title: '발행?',
  onConfirm: async () => {
    await publish();
    router.push('/list');
  }
});

// onConfirm만 사용
await dialog.confirm({
  title: '계속하시겠습니까?',
  onConfirm: async () => {
    await process();
  }
});
```

**Alert 패턴:**
```typescript
// Alert 후 필수 액션 (리다이렉트, 새로고침)
await dialog.alert({
  title: '세션 만료',
  onConfirm: () => router.push('/login')
});

// Alert와 강하게 결합된 작업
await dialog.alert({
  title: '업데이트 완료',
  onConfirm: () => window.location.reload()
});

// 단순 알림 (콜백 없이)
await dialog.alert({
  title: '저장 완료',
  variant: 'success'
});
```

## 기술 노트

### Promise 기반 API

내부적으로 `useRef`에 Promise의 resolve 함수를 저장하고, 사용자가 버튼을 클릭하면 resolve를 호출하여 Promise를 완료시킵니다.

```typescript
const confirm = (data: ConfirmDialogData): Promise<boolean> => {
  return new Promise((resolve) => {
    resolveRef.current = resolve;  // resolve 저장
    setDialogState({ type: 'confirm', data });
  });
};

// 버튼 클릭 시
const handleConfirm = () => {
  resolveRef.current?.(true);  // Promise 완료
  setDialogState(null);
};
```

### React 19 use() 훅

기존 `useContext` 대신 `use()`를 사용하여 더 간결하고 미래 지향적인 코드를 작성했습니다.

```typescript
import { use } from 'react';

export function useDialog() {
  const context = use(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
}
```

## 확장 가이드

향후 Custom Dialog 기능이 필요한 경우:

```typescript
// 1. dialog-provider.tsx에 타입 추가
interface CustomDialogData {
  title: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

// 2. DialogState에 타입 추가
type DialogState =
  | { type: 'confirm'; data: ConfirmDialogData }
  | { type: 'alert'; data: AlertDialogData }
  | { type: 'custom'; data: CustomDialogData }  // 추가
  | null;

// 3. custom 함수 구현
const custom = (data: CustomDialogData): Promise<any> => {
  return new Promise((resolve) => {
    resolveRef.current = resolve;
    setDialogState({ type: 'custom', data });
  });
};

// 4. CustomDialogComponent 구현 및 렌더링
```

## 관련 파일

- `src/shared/providers/dialog-provider.tsx` - Provider 구현
- `src/shared/providers/index.ts` - Export
- `src/shared/ui/alert-dialog.tsx` - Shadcn AlertDialog (Confirm용)
- `src/shared/ui/dialog.tsx` - Shadcn Dialog (Alert용)
- `src/app/layout.tsx` - Provider 등록

## 라이선스

이 프로젝트의 일부입니다.
