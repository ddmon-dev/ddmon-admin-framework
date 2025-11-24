# 개발 가이드

## 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
yarn dev

# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start

# ESLint 실행
yarn lint
```

### Claude Code용 빌드

Claude Code에서 빌드 시 `.next-claude` 디렉토리를 사용합니다.

```bash
IS_CLAUDE=1 yarn build
```

`.gitignore`에 `/.next-claude/`가 추가되어 있습니다.

## 환경변수

### 필수 환경변수

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### 선택 환경변수

```bash
# CKEditor 이미지 업로드 루트 폴더 (기본: 'editor')
NEXT_PUBLIC_EDITOR_UPLOAD_ROOT=editor
```

## 설정 파일

### next.config.ts

```typescript
const nextConfig: NextConfig = {
  distDir: process.env.IS_CLAUDE ? '.next-claude' : undefined,
  experimental: {
    reactCompiler: true,  // React Compiler 활성화
  },
};
```

**주요 설정:**
- React Compiler: 활성화 (불필요한 useMemo, useCallback 지양)
- distDir: Claude Code 전용 빌드 디렉토리

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
  "next": "16.0.3",
  "react": "19.2.0",
  "react-dom": "19.2.0",
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
- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0 (React Compiler 활성화)
- **Language**: TypeScript (Strict Mode)
- **Node.js**: 24.3.0
- **Package Manager**: Yarn

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

### React Compiler

React Compiler가 활성화되어 있으므로 불필요한 `useMemo`, `useCallback` 사용을 지양합니다.

```typescript
// ❌ 불필요
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// ✅ React Compiler가 자동 최적화
const value = computeExpensiveValue(a, b);
```

### Tailwind V4

V4는 PostCSS 플러그인 방식이므로 `globals.css`에서 설정을 관리합니다.

```css
/* src/app/globals.css */
@import "tailwindcss";
```

### FSD 패턴

새로운 코드 추가 시 반드시 적절한 레이어(features, widgets, shared)에 배치합니다.

자세한 내용: [architecture.md](architecture.md)
