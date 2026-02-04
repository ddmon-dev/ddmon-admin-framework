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
├── next-auth.ts             # NextAuth 핸들러
├── types.ts                 # 타입 정의
├── use-auth.ts              # Client 훅 (useAuth, useRequireAuth)
├── idle-logout-provider.tsx # 유휴 로그아웃
└── index.ts                 # Barrel exports
```

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
import { auth } from '@/features/auth';

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
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // JWT 토큰에 사용자 정보 저장
      if (user) {
        token.id = user.id;
        token.super_admin = user.super_admin;
      }
      // updateSession() 호출 시 토큰 업데이트
      if (trigger === 'update' && session) {
        token.name = session.name ?? token.name;
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

## 참고

NextAuth 공식 문서: https://authjs.dev/
