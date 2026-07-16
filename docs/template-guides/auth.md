# 인증 시스템

NextAuth 기반의 인증 시스템입니다.

## 구조

```
features/auth/
├── ui/                      # 인증 UI
│   ├── sign-in-form.tsx     # 로그인 폼
│   ├── auth-layout.tsx      # 인증 페이지 레이아웃
│   ├── require-auth.tsx     # 인증 필수 래퍼
│   └── update-profile-dialog.tsx
├── actions/                 # Server Actions
│   ├── index.ts
│   └── update-profile.ts
├── utils/
│   ├── server.ts            # requireAuth, getUserSession
│   └── password.ts          # 비밀번호 해싱
├── config.ts                # NextAuth 설정 (default export)
├── schema.ts                # Zod 스키마 (updateProfileSchema)
├── server.ts                # NextAuth 인스턴스 (auth·handlers) — server-only
├── types.ts                 # 타입 정의
├── use-auth.ts              # Client 훅 (useAuth, useRequireAuth)
├── idle-logout-provider.tsx # 유휴 로그아웃
└── index.ts                 # Barrel exports
```

## 서버/클라이언트 경계

인증 코드는 실행 런타임에 따라 진입점이 나뉩니다. 핵심은 **클라이언트 번들에
서버 인증 로직(authorize·secret 키)이 실리지 않게** 하는 것입니다.

| 무엇을 | 어디서 import | 비고 |
| --- | --- | --- |
| `signIn`·`signOut`·`useAuth`·`useRequireAuth` | `@/features/auth` (배럴) | 클라이언트 훅 |
| `RequireAuth`·UI 컴포넌트 | `@/features/auth` (배럴) | `'use client'` |
| `requireAuth`·`getUserSession`·`updateProfile` | `@/features/auth` (배럴) | `'use server'` 액션 |
| `auth`·`nextAuthHandlers` | **`@/features/auth/server`** | 서버 전용 (RSC·Route Handler) |

배럴(`@/features/auth`)은 **"클라이언트 안전 기본값"**입니다 — 여기서 가져온 건
클라 번들에 넣어도 안전합니다. 서버 세션 API만 `@/features/auth/server`로 분리했습니다.

### server-only 가드레일

`server.ts`(NextAuth 인스턴스)와 `shared/lib/supabase/server.ts`(secret 키 팩토리)는
`import 'server-only'`로 잠겨 있습니다. 이 모듈이 클라 번들에 포함되면 **빌드가 실패**해,
실수로 서버 인증 코드가 브라우저로 새는 것을 컴파일 타임에 막습니다.

> Vitest는 RSC 경계가 없어 server-only가 throw하므로 `vitest.config.mts`에서
> no-op으로 alias합니다(`test/stubs/server-only.ts`). 실제 빌드 가드레일에는 영향 없습니다.

## 라우팅

### 인증 페이지

```
app/(auth)/auth/
└── sign-in/
```

Route Group `(auth)`를 사용하여 레이아웃 없이 표시됩니다.

### 보호된 페이지

```
app/(protected)/
├── layout.tsx              # requireAuth() 호출
├── (super-admin-only)/     # 슈퍼 관리자 전용
│   ├── layout.tsx          # requireAuth({ requireSuper: true })
│   └── admins/
└── (system)/
    └── unauthorized/       # 권한 없음 페이지
```

Route Group `(protected)`를 사용하며 Sidebar + Header가 포함됩니다.

## 라우팅 보호

### Layout 기반 보호 (권장)

`requireAuth()`를 layout.tsx에서 호출하여 하위 페이지를 보호합니다.

```typescript
// app/(protected)/layout.tsx
import { requireAuth } from '@/features/auth/utils/server';

export default async function ProtectedLayout({ children }) {
  await requireAuth(); // 미인증 시 자동 redirect
  return <>{children}</>;
}
```

### 슈퍼 관리자 전용

```typescript
// app/(protected)/(super-admin-only)/layout.tsx
import { requireAuth } from '@/features/auth/utils/server';

export default async function SuperAdminLayout({ children }) {
  await requireAuth({ requireSuper: true }); // 슈퍼 관리자 아니면 /unauthorized
  return <>{children}</>;
}
```

## 사용 방법

### 로그인 (Client Component)

```typescript
'use client';

import { signIn } from '@/features/auth';
// 또는
import { signIn } from 'next-auth/react';

async function handleSubmit(values: SignInValues) {
  const result = await signIn('credentials', {
    id: values.id,
    password: values.password,
    redirect: false,
  });

  if (result?.error) {
    toast.error('로그인 실패');
  } else {
    router.push('/');
  }
}
```

### 로그아웃 (Client Component)

```typescript
'use client';

import { signOut } from '@/features/auth';
// 또는
import { signOut } from 'next-auth/react';

await signOut({ callbackUrl: '/auth/sign-in' });
```

### 세션 확인 (Server Component)

```typescript
import { auth } from '@/features/auth/server';

const session = await auth();
if (!session) {
  redirect('/auth/sign-in');
}

// 또는 requireAuth 사용 (권장)
import { requireAuth } from '@/features/auth';

const user = await requireAuth();
console.log(user.name);
```

### 권한 체크 (Server Component)

```typescript
import { requireAuth } from '@/features/auth';

// 슈퍼 관리자 체크
const user = await requireAuth({ requireSuper: true });
// user.super_admin은 항상 true

// 또는 수동 체크
const user = await requireAuth();
if (!user.super_admin) {
  redirect('/unauthorized');
}
```

### Client Component 훅

```typescript
'use client';

import { useAuth, useRequireAuth } from '@/features/auth';

// 기본 사용
function Dashboard() {
  const { user, isLoading, isSuperAdmin } = useAuth();

  if (isLoading) return <Spinner />;
  if (!user) return <div>로그인이 필요합니다</div>;

  return (
    <div>
      환영합니다, {user.name}님
      {isSuperAdmin && <AdminPanel />}
    </div>
  );
}

// 인증 필수 (미인증 시 자동 redirect)
function ProtectedPage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading || !user) return null;

  return <div>보호된 페이지</div>;
}

// 슈퍼 관리자 전용
function SuperAdminPage() {
  const { user, isLoading } = useRequireAuth({ requireSuper: true });

  if (isLoading || !user) return null;

  return <div>슈퍼 관리자 전용</div>;
}
```

## 설정

### config.ts

NextAuth 설정은 `features/auth/config.ts`에 default export로 정의되어 있습니다.

```typescript
export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        // DB에서 관리자 조회 및 비밀번호 검증
        return { id, name, email, super_admin };
      },
    }),
  ],
  pages: {
    signIn: APP_CONFIG.AUTH.PATHS.SIGN_IN, // '/auth/sign-in'
    signOut: APP_CONFIG.AUTH.PATHS.SIGN_IN,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // JWT 토큰에 사용자 정보 저장
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.super_admin = user.super_admin;
      }
      // updateSession() 호출 시 토큰 업데이트 (프로필 수정 반영)
      if (trigger === 'update' && session) {
        token.name = session.name ?? token.name;
        token.email = session.email ?? token.email;
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 토큰 정보 복사
      session.user.id = token.id!;
      session.user.super_admin = token.super_admin!;
      return session;
    },
  },
} satisfies NextAuthConfig;
```

## 타입

```typescript
// next-auth.d.ts에서 확장됨
interface User {
  id: string;
  name: string;
  email: string;
  super_admin: boolean;
}

// features/auth/types.ts
export type SignInValues = {
  id: string;
  password: string;
};

export type SignInResult = {
  success: boolean;
  error?: string;
};

export type UpdateProfileValues = {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};
```

## 유틸리티 함수

### Server 유틸리티

```typescript
import { getUserSession, requireAuth } from '@/features/auth';

// 세션 조회 (null 반환 가능)
const user = await getUserSession();

// 인증 필수 (미인증 시 redirect)
const user = await requireAuth();

// 슈퍼 관리자 필수
const user = await requireAuth({ requireSuper: true });
```

### Client 유틸리티

```typescript
import { useAuth, useRequireAuth, signIn, signOut } from '@/features/auth';

// 인증 상태 조회
const { user, status, isLoading, isSuperAdmin } = useAuth();

// 인증 필수 + 자동 redirect
const auth = useRequireAuth();
const auth = useRequireAuth({ requireSuper: true });

// 로그인/로그아웃
await signIn('credentials', { id, password, redirect: false });
await signOut({ callbackUrl: '/auth/sign-in' });
```

## 자동 로그아웃 (유휴 세션)

일정 시간 활동이 없으면 자동으로 로그아웃합니다. `(protected)/layout.tsx`에서 `IdleLogoutProvider`가 감싸며, 시간 설정은 `APP_CONFIG.AUTH`에서 관리합니다.

```typescript
// src/app.config.ts
AUTH: {
  IDLE_TIMEOUT_MINUTES: 60, // 유휴 60분 후 자동 로그아웃
  IDLE_WARNING_MINUTES: 5,  // 로그아웃 5분 전 경고 표시
},
```

- 세션 JWT의 `maxAge`도 `IDLE_TIMEOUT_MINUTES`와 동일하게 설정됩니다(`server.ts`).
- 마우스/키보드 활동을 감지해 타이머를 리셋하고, 경고 시간에 도달하면 알림을 띄웁니다.

## 조건부 렌더링 가드 (`RequireAuth`)

훅(`useRequireAuth`)이 페이지 단위 리다이렉트 가드라면, `RequireAuth` 컴포넌트는 UI 일부만 조건부로 렌더링할 때 사용합니다.

```typescript
import { RequireAuth } from '@/features/auth';

// 슈퍼 관리자에게만 노출
<RequireAuth requireSuper>
  <DangerZone />
</RequireAuth>
```

## 프로필 수정

로그인 사용자가 이름·이메일·비밀번호를 변경합니다. `update-profile-dialog.tsx`(UI) + `update-profile.ts`(Server Action) + `updateProfileSchema`(검증)로 구성됩니다.

```typescript
// 흐름
1. UpdateProfileDialog에서 updateProfileSchema로 클라이언트 검증
2. updateProfile 서버 액션 호출 (현재 비밀번호 확인 후 변경)
3. 성공 시 useAuth의 세션 update() 트리거 → jwt 콜백이 token.name/email 갱신
```

`UpdateProfileValues`는 `name`, `email`과 선택적 비밀번호 변경 필드(`currentPassword`, `newPassword`, `confirmPassword`)를 포함합니다.

## 참고

NextAuth 공식 문서: https://authjs.dev/
