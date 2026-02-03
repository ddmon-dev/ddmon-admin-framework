# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Admin Template은 Next.js 16 기반의 관리자 대시보드 템플릿입니다.

### 핵심 원칙

- **우아함**: 불필요한 복잡성 없이 깔끔한 구조
- **직관성**: 누가 봐도 바로 이해되는 명확한 코드
- **실용성**: 과도한 추상화보다 실제 개발과 유지보수에 도움되는 구조
- **오버엔지니어링 금지**: 컨텍스트와 상황에 맞는 적절한 수준의 개발

### 기술 스택

| 분야          | 기술                           |
| ------------- | ------------------------------ |
| **Framework** | Next.js 16.0.3 (App Router)    |
| **React**     | 19.2.0 (React Compiler 활성화) |
| **Language**  | TypeScript (Strict Mode)       |
| **Database**  | Supabase                       |
| **CSS**       | Tailwind CSS V4                |
| **UI**        | Shadcn UI (New York 스타일)    |
| **Form**      | React Hook Form + Zod          |

---

## 상세 문서

프로젝트의 특정 주제에 대한 자세한 내용은 `docs/` 폴더를 참조하세요.

### 아키텍처 & 시스템

- **[프로젝트 구조 & 컨벤션](docs/conventions.md)** - FSD 아키텍처, 파일명 규칙, lib vs utils 구분
- **[manage-modules (CRUD 시스템)](docs/manage-modules.md)** - 템플릿 기반 CRUD 모듈, 핵심 패턴
- **[파일 시스템](docs/file-system.md)** - FormFileUpload + 에디터(Tiptap) 이미지 업로드
- **[인증 시스템](docs/auth.md)** - NextAuth 설정, 라우팅, 세션 관리

### 개발

- **[개발 가이드](docs/development.md)** - 명령어, 환경변수, 설정 파일
- **[Supabase 워크플로우](docs/supabase.md)** - 로컬 개발, 클라우드 배포, 마이그레이션

---

## 빠른 참조

### 새 CRUD 모듈 추가

```bash
# 1. 템플릿 복사
cp -r src/features/manage-modules/_template src/features/manage-modules/products

# 2. config.ts 수정
export const CONFIG = {
  tableName: 'products',
  ...
};

# 3. types.ts 수정
export type RowData = BaseRowData<'products'>;

# 4. Server Actions 수정 (tableName 변경)
# 5. 컴포넌트 수정 (list-columns, filters, item-form)
```

📄 자세한 내용: [manage-modules.md](docs/manage-modules.md#새로운-모듈-추가)

### 파일 업로드 추가

**FormFileUpload (manage-modules 첨부파일):**

```typescript
// types.ts
export type ItemFiles = {
  attachments?: DbFileMetadata[];
};

// item-form.tsx
<FormFileUpload name="files.attachments" label="첨부 파일" />;

// actions/create-item.ts
uploadedFiles = await processFiles({
  filesInput: values.files,
  folder: `notices/${id}`,
});
```

**Tiptap (에디터 이미지):**

```typescript
<FormEditor entity={CONFIG.tableName} name="content" label="내용" />
```

📄 자세한 내용: [file-system.md](docs/file-system.md)

### 새 페이지 추가

```typescript
// app/(protected)/products/page.tsx
import { ProductList } from '@/features/products';

export default function ProductsPage() {
  return <ProductList />;
}
```

📄 자세한 내용: [conventions.md](docs/conventions.md#새로운-기능-추가-시)

### Supabase 로컬 개발

```bash
# 초기화 (새 프로젝트)
npm run db:init

# 로컬 Supabase 시작/중지
npm run db:start
npm run db:stop

# 마이그레이션 재적용
npm run db:reset

# 새 마이그레이션 생성
npm run db:migrate:new feature_name

# 클라우드 연결 및 배포
npm run db:link --project-ref <ref>
npm run db:push
```

📄 자세한 내용: [supabase.md](docs/supabase.md)

---

## 개발 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# ESLint
npm run lint
```

📄 자세한 내용: [development.md](docs/development.md)

---

## 파일 구조

```
src/
├── app/                     # Next.js App Router (라우팅)
│   ├── (auth)/             # 인증 페이지 (레이아웃 없음)
│   └── (protected)/        # 보호된 페이지 (Sidebar + Header)
├── features/                # 기능 레이어 (비즈니스 로직)
│   ├── auth/
│   └── manage-modules/     # CRUD 모듈 시스템
├── widgets/                 # 위젯 레이어 (복합 UI)
│   ├── app-sidebar/
│   ├── app-breadcrumb/
│   └── app-header/
└── shared/                  # 공유 레이어
    ├── ui/                  # 67개 컴포넌트 (Shadcn UI)
    ├── lib/                 # 도메인 라이브러리
    ├── utils/               # 범용 유틸리티
    ├── hooks/
    └── schemas/
```

📄 자세한 내용: [conventions.md](docs/conventions.md#프로젝트-아키텍처)

---

## 코딩 컨벤션

### 파일명

- **기본**: kebab-case (`user-profile.tsx`)
- **Hooks**: use-kebab-case (`use-mobile.ts`)
- **설정 (도메인)**: `config.ts`, `types.ts`
- **설정 (루트)**: `*.config.ts` (`app.config.ts`, `next.config.ts`)

### 코드 네이밍

- **컴포넌트**: PascalCase (`UserProfile`)
- **함수/변수**: camelCase (`getUserData`)
- **상수**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **타입**: PascalCase (`UserData`)

### Git 커밋

```
타입: 제목

본문 (선택사항)
```

**타입**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

📄 자세한 내용: [conventions.md](docs/conventions.md#파일명-규칙)

---

## 문서 작성 가이드

새로운 기능이나 시스템을 추가할 때 다음 패턴을 따르세요.

### 복잡한 시스템

`docs/` 폴더에 전문 문서 작성:

```markdown
# 기능명

## 개요

핵심 특징 3-5개

## 구조

폴더 트리

## 핵심 개념

주요 패턴 설명 (코드 예시 5-10줄)

## 사용 방법

복사-붙여넣기 가능한 템플릿

## 주의사항

간결하게 (5-10줄)
```

### CLAUDE.md 업데이트

상세 문서 섹션에 링크 추가:

```markdown
### 아키텍처 & 시스템

- **[새 기능](docs/new-feature.md)** - 간단한 설명
```

빠른 참조 섹션에 예시 추가 (선택사항)

---

## 참고

- **우직실 원칙**: 우아함, 직관성, 실용성 (프로젝트 내부 용어)
- **Path Alias**: `@/*` = `./src/*`
- **React Compiler**: 활성화 (불필요한 useMemo/useCallback 지양)
- **Tailwind V4**: PostCSS 플러그인 방식

---

**Claude Code 사용 시 문서를 먼저 확인하고 필요한 섹션을 선택적으로 읽어주세요.**
