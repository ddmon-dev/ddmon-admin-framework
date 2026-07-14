# 개발 가이드

## 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 실행
npm run lint

# 타입 검사 (tsc --noEmit)
npm run type-check

# 테스트 (Vitest)
npm run test        # watch 모드
npm run test:run    # 1회 실행 (CI)
```

> Supabase 로컬 DB 명령어(`db:start`, `db:reset` 등)는 [supabase.md](supabase.md#명령어)를 참고하세요.

## 환경변수

`.env.local.example`을 `.env.local`로 복사한 뒤 값을 채웁니다.

### 필수 환경변수

```bash
# Supabase (클라이언트는 서버 액션만 사용 → anon/publishable key 불필요)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SECRET_KEY=

# Supabase Storage 버킷명 (.env의 값과 config.toml의 버킷 선언이 일치해야 함)
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME=public-assets

# NextAuth
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=             # 예: http://localhost:3000

# SMTP (이메일 발송 — 문의 답변 등)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM="ADMIN <noreply@domain.com>"
```

> 실제 코드가 참조하는 환경변수만 정리한 것입니다. `NEXT_PUBLIC_*` 접두어가 붙은 값만 클라이언트 번들에 노출되며, 나머지(`SUPABASE_SECRET_KEY`, `SMTP_*`, `NEXTAUTH_SECRET`)는 서버 전용입니다.
> 에디터 이미지 업로드 루트 등 정적 설정값은 환경변수가 아니라 `src/app.config.ts`의 `APP_CONFIG`로 관리합니다([conventions.md](conventions.md#app_config-중앙-설정) 참고).

## 설정 파일

### next.config.ts

```typescript
const nextConfig: NextConfig = {
  async headers() { ... }, // 보안 헤더 (X-Frame-Options 등)
};
```

**주요 설정:**

- headers: 전역 보안 헤더 (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)
- React Compiler: 비활성화 (사유는 하단 참고사항 참조)

> 파일 업로드는 서버 액션 body가 아니라 presigned URL로 Storage에 직접 올리므로 `serverActions.bodySizeLimit`을 상향할 필요가 없어 기본값(1MB)을 사용합니다.

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**주요 설정:**

- Strict mode: 활성화
- Path alias: `@/*` → `./src/*`

### components.json (Shadcn UI)

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/shared/",
    "utils": "@/shared/utils/classnames",
    "ui": "@/shared/ui",
    "lib": "@/shared/lib",
    "hooks": "@/shared/hooks"
  }
}
```

**주요 설정:**

- 스타일: New York, 아이콘: Lucide
- 기본 색상: neutral, CSS Variables: 사용
- `tailwind.config`은 빈 문자열 — Tailwind V4는 설정 파일 없이 `globals.css`에서 관리하므로 `tailwind.config.ts`가 존재하지 않습니다.

### Tailwind CSS V4

**특징:**

- PostCSS 플러그인 방식
- CSS Variables 기반 테마
- `globals.css`에서 @import로 설정

**설정 파일:**

- `postcss.config.mjs`: `@tailwindcss/postcss` 플러그인 등록
- `src/app/globals.css`: @import로 Tailwind 설정

## 주요 의존성

정확한 버전은 항상 `package.json`이 기준(SSOT)입니다. 아래는 스택을 이해하기 위한 핵심 의존성의 메이저 버전입니다.

| 패키지 | 메이저 | 역할 |
| --- | --- | --- |
| `next` | 16 | App Router, Server Actions |
| `react` / `react-dom` | 19 | UI 런타임 |
| `typescript` | 5 | 정적 타입 (strict) |
| `zod` | 4 | 런타임 스키마 검증 (SSOT) |
| `react-hook-form` + `@hookform/resolvers` | 7 / 5 | 폼 상태 + zod 연동 |
| `tailwindcss` + `@tailwindcss/postcss` | 4 | 스타일 (PostCSS 방식) |
| `@supabase/supabase-js` + `@supabase/ssr` | 2 / 0.x | DB / Storage |
| `next-auth` | 5 (beta) | 인증 |
| `nodemailer` | 7 | 이메일(SMTP) 발송 |
| `xlsx-js-style` | 1 | 엑셀 내보내기 |
| `@tanstack/react-table` | 8 | 데이터 테이블 |
| `@dnd-kit/*` | 6~10 | 순서 변경(reorder) 드래그 |
| `@tiptap/*` | 3 | 리치 텍스트 에디터 |
| `vitest` + `@testing-library/*` | 4 / 16 | 테스트 |

> `zod`는 4.x입니다. 3.x와 API가 다르므로(예: `z.string().min()` 체이닝, 에러 포맷) 외부 예시를 참고할 때 버전을 확인하세요.

## 기술 스택

### Core

- **Framework**: Next.js 16 (App Router)
- **React**: 19
- **Language**: TypeScript (Strict Mode)
- **Node.js**: 24.x
- **Package Manager**: npm

### Styling & UI

- **CSS Framework**: Tailwind CSS V4 (PostCSS 플러그인)
- **UI Library**: Shadcn UI (New York 스타일)
- **Icons**: Lucide React
- **Theme**: next-themes (다크모드)

### Forms & Validation

- **Form**: React Hook Form
- **Validation**: Zod (v4)

### Database & Infra

- **Database / Storage**: Supabase (Postgres + Storage)
- **Auth**: NextAuth v5 (Credentials)
- **Email**: Nodemailer (SMTP)
- **Excel**: xlsx-js-style

### Fonts

- **영문(본문)**: Poppins (Google Fonts, `--font-poppins`)
- **영문(강조)**: Oswald (Google Fonts, `--font-oswald`)
- **한글**: Pretendard (Local Fonts, `--font-pretendard`)

## 참고사항

### React Compiler (비활성화)

React Compiler는 **의도적으로 비활성화** 상태입니다.

**사유**: 프로덕션 빌드에서 컴파일러 버그가 재현됩니다 (2026-07-14, Next.js 16.1.6 + babel-plugin-react-compiler 1.0.0 실측).

- 증상: `CategoryButtonGroup`(카테고리/언어 필터) 클릭 시 `TypeError: P is not a function` — `useQueryParams()`에서 구조분해한 오버로드 함수 `set`이 컴파일러의 자동 메모이제이션 캐시를 거치며 함수가 아닌 값으로 변질
- 개발 모드에서는 정상, **프로덕션 빌드에서만** 발생 (동일 조작을 컴파일러 OFF로 재빌드하면 정상 — 대조 실험으로 인과 확인)
- 재활성화 조건: 트리거 패턴(오버로드 함수 구조분해 캡처) 제거 후 프로덕션 런타임 재검증 통과 시

### Tailwind V4

V4는 PostCSS 플러그인 방식이므로 `globals.css`에서 설정을 관리합니다.

```css
/* src/app/globals.css */
@import 'tailwindcss';
@import 'tw-animate-css';
@custom-variant dark (&:is(.dark *));
```

### FSD 패턴

새로운 코드 추가 시 반드시 적절한 레이어(features, shared)에 배치합니다.

자세한 내용: [conventions.md](conventions.md#프로젝트-아키텍처)
