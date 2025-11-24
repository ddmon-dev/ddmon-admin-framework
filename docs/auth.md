# 인증 시스템

NextAuth 기반의 인증 시스템입니다.

## 구조

```
features/auth/
├── ui/                      # 인증 UI
│   ├── sign-in-form.tsx
│   ├── sign-up-form.tsx
│   └── forgot-password-form.tsx
├── actions/                 # Server Actions
│   ├── sign-in.ts
│   ├── sign-out.ts
│   └── ...
├── config.ts                # NextAuth 설정
└── types.ts                 # 타입 정의
```

## 라우팅

### 인증 페이지

```
app/(auth)/auth/
├── sign-in/
├── sign-up/
└── forgot-password/
```

Route Group `(auth)`를 사용하여 레이아웃 없이 표시됩니다.

### 보호된 페이지

```
app/(protected)/
├── settings/
└── page.tsx
```

Route Group `(protected)`를 사용하며 Sidebar + Header가 포함됩니다.

### 권한 없음

`app/unauthorized/`: 권한이 없는 사용자에게 표시

## 사용 방법

### 로그인

```typescript
// features/auth/ui/sign-in-form.tsx
import { signIn } from '@/features/auth/actions/sign-in';

async function onSubmit(values: SignInValues) {
  const result = await signIn(values);
  if (result.success) {
    redirect('/');
  }
}
```

### 로그아웃

```typescript
import { signOut } from '@/features/auth/actions/sign-out';

await signOut();
```

### 세션 확인

```typescript
import { auth } from '@/features/auth/handler';

const session = await auth();
if (!session) {
  redirect('/auth/sign-in');
}
```

### 권한 체크

```typescript
// Server Component
const session = await auth();
if (!session?.user?.role === 'admin') {
  redirect('/unauthorized');
}

// Client Component
'use client';
import { useSession } from 'next-auth/react';

const { data: session } = useSession();
if (session?.user?.role === 'admin') {
  // 관리자 전용 기능
}
```

## 설정

### config.ts

NextAuth 설정은 `features/auth/config.ts`에 정의되어 있습니다.

```typescript
export const authConfig = {
  providers: [...],
  callbacks: {
    authorized: ({ auth, request }) => {
      // 인증 로직
    },
  },
};
```

### Middleware

인증 미들웨어는 `/middleware.ts`에서 적용됩니다.

```typescript
export { auth as middleware } from '@/features/auth/handler';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## 타입

```typescript
// features/auth/types.ts
export type AdminUser = {
  id: string;        // UUID (데이터베이스 Primary Key)
  name: string;      // 실제 이름
  superAdmin: boolean;
};

export type SignInValues = {
  id: string;        // 로그인 아이디
  password: string;
};
```

## 참고

NextAuth 공식 문서: https://next-auth.js.org/
