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
```

## 환경변수

### 필수 환경변수

```bash
# Supabase (클라이언트는 서버 액션만 사용 → anon key 불필요)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SECRET_KEY=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### 선택 환경변수

```bash
# 에디터 이미지 업로드 루트 폴더 (기본: 'editor')
NEXT_PUBLIC_EDITOR_UPLOAD_ROOT=editor
```

## 설정 파일

### next.config.ts

```typescript
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() { ... }, // 보안 헤더 (X-Frame-Options 등)
};
```

**주요 설정:**

- serverActions.bodySizeLimit: 서버 액션 요청 body 한도 상향
- React Compiler: 비활성화 (사유는 하단 참고사항 참조)

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
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/shared/ui",
    "utils": "@/shared/utils",
    "ui": "@/shared/ui",
    "lib": "@/shared/utils",
    "hooks": "@/shared/hooks"
  }
}
```

**주요 설정:**

- 스타일: New York
- 기본 색상: neutral
- CSS Variables: 사용

### Tailwind CSS V4

**특징:**

- PostCSS 플러그인 방식
- CSS Variables 기반 테마
- `globals.css`에서 @import로 설정

**설정 파일:**

- `postcss.config.js`: Tailwind 플러그인 등록
- `src/app/globals.css`: @import로 Tailwind 설정

## 주요 의존성

### 프로덕션

```json
{
  "next": "16.0.7",
  "react": "19.2.1",
  "react-dom": "19.2.1",
  "@hookform/resolvers": "3.9.1",
  "react-hook-form": "7.54.2",
  "zod": "3.24.1",
  "tailwindcss": "4.0.12",
  "lucide-react": "0.469.0",
  "next-themes": "0.4.6"
}
```

### 개발

```json
{
  "typescript": "5.7.2",
  "eslint": "9.18.0",
  "@eslint/eslintrc": "3.2.0"
}
```

## 기술 스택

### Core

- **Framework**: Next.js 16.0.7 (App Router)
- **React**: 19.2.1
- **Language**: TypeScript (Strict Mode)
- **Node.js**: 24.3.0
- **Package Manager**: npm run

### Styling & UI

- **CSS Framework**: Tailwind CSS V4 (PostCSS 플러그인)
- **UI Library**: Shadcn UI (New York 스타일)
- **Icons**: Lucide React
- **Theme**: next-themes (다크모드)

### Forms & Validation

- **Form**: React Hook Form
- **Validation**: Zod

### Database

- **Database**: Supabase
- **Storage**: Supabase Storage

### Fonts

- **영문**: Poppins (Google Fonts)
- **한글**: Pretendard (Local Fonts)

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
```

### FSD 패턴

새로운 코드 추가 시 반드시 적절한 레이어(features, shared)에 배치합니다.

자세한 내용: [conventions.md](conventions.md#프로젝트-아키텍처)
