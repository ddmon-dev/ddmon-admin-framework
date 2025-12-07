# Auth 시스템 개선 가이드 (2025-12-07)

이 문서는 admin-template 기반 프로젝트에 인증 시스템 개선사항을 적용하기 위한 가이드입니다.
다른 프로젝트에서 Claude Code가 이 문서를 참고하여 작업을 수행할 수 있습니다.

---

## 작업 개요

1. **IdleLogout 프로덕션 버그 수정** - 브라우저 닫아도 세션 만료되도록
2. **시간 설정 단위 개선** - 밀리초 → 분 단위
3. **Auth 구조 정리** - 파일명, import 경로 통일

---

## 작업 1: IdleLogout 프로덕션 버그 수정

### 문제

- 브라우저 닫으면 클라이언트 타이머 사라짐
- NextAuth 세션 기본 maxAge는 30일 → 브라우저 닫아도 로그인 유지됨

### 수정 대상

| 파일 | 작업 |
|------|------|
| `src/features/auth/handler.ts` (또는 `next-auth.ts`) | `maxAge` 설정 추가 |
| `src/features/auth/idle-logout-provider.tsx` | 세션 갱신 로직 추가 |
| `src/app.config.ts` | 시간 설정 분 단위로 변경 |

### 1-1. app.config.ts 수정

**Before:**
```typescript
AUTH: {
  // ...
  IDLE_TIMEOUT: 1 * 60 * 60 * 1000,
  IDLE_WARNING_TIME: 5 * 60 * 1000,
}
```

**After:**
```typescript
AUTH: {
  // ...
  IDLE_TIMEOUT_MINUTES: 60,    // 자동 로그아웃 (60분)
  IDLE_WARNING_MINUTES: 5,     // 로그아웃 경고 표시 (5분 전)
}
```

### 1-2. handler.ts (또는 next-auth.ts) 수정

**Before:**
```typescript
export const {
  handlers: nextAuthHandlers,
  signIn: nextAuthSignIn,
  signOut: nextAuthSignOut,
  auth,
} = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});
```

**After:**
```typescript
import { APP_CONFIG } from '@/app.config';
import NextAuth from 'next-auth';
import authConfig from './config';

export const { handlers: nextAuthHandlers, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
    maxAge: APP_CONFIG.AUTH.IDLE_TIMEOUT_MINUTES * 60, // 분 → 초
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});
```

**변경점:**
- `maxAge` 추가 (분 → 초 변환)
- `nextAuthSignIn`, `nextAuthSignOut` 제거 (미사용)

### 1-3. idle-logout-provider.tsx 수정

**Before:**
```typescript
import { signOut } from 'next-auth/react';

export function IdleLogoutProvider({
  children,
  timeout = APP_CONFIG.AUTH.IDLE_TIMEOUT,
  warningTime = APP_CONFIG.AUTH.IDLE_WARNING_TIME,
  // ...
}: IdleLogoutProviderProps) {
  // useSession 또는 다른 방식 사용

  const handleActivity = () => {
    resetTimers();
  };
}
```

**After:**
```typescript
'use client';

import { APP_CONFIG } from '@/app.config';
import { useEffect, useRef } from 'react';
import { signOut, useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { useDialog } from '@/shared/ui/app-dialog';

interface IdleLogoutProviderProps {
  children: React.ReactNode;
  /** 자동 로그아웃 시간 (분) */
  timeoutMinutes?: number;
  /** 로그아웃 경고 표시 시간 (분) */
  warningMinutes?: number;
  onWarning?: () => void;
  onIdle?: () => void;
}

const MINUTE_MS = 60 * 1000;

export function IdleLogoutProvider({
  children,
  timeoutMinutes = APP_CONFIG.AUTH.IDLE_TIMEOUT_MINUTES,
  warningMinutes = APP_CONFIG.AUTH.IDLE_WARNING_MINUTES,
  onWarning,
  onIdle,
}: IdleLogoutProviderProps) {
  const dialog = useDialog();
  const { updateSession } = useAuth();
  const warningTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const logoutTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastUpdateRef = useRef<number>(Date.now());

  // 분 → ms 변환
  const timeout = timeoutMinutes * MINUTE_MS;
  const warningTime = warningMinutes * MINUTE_MS;

  useEffect(() => {
    const resetTimers = () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

      warningTimerRef.current = setTimeout(() => {
        if (onWarning) {
          onWarning();
        } else {
          toast.warning('일정 시간 활동이 없어 잠시 후 자동 로그아웃됩니다.');
        }
      }, timeout - warningTime);

      logoutTimerRef.current = setTimeout(() => {
        if (onIdle) {
          onIdle();
        } else {
          dialog.alert({
            title: 'Session Expired',
            description: '일정 시간 활동이 없어 로그아웃 되었습니다.',
            variant: 'default',
            size: 'sm',
            layout: 'vertical',
          });
          signOut();
        }
      }, timeout);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'] as const;

    const handleActivity = () => {
      resetTimers();

      // warningTime 간격으로 세션 갱신 (서버 토큰 만료 방지)
      const now = Date.now();
      if (now - lastUpdateRef.current > warningTime) {
        lastUpdateRef.current = now;
        updateSession();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    resetTimers();

    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [timeout, warningTime, onWarning, onIdle, updateSession]);

  return <>{children}</>;
}
```

**핵심 변경점:**
- `useAuth()`에서 `updateSession` 가져오기
- `handleActivity`에서 `warningTime` 간격으로 `updateSession()` 호출
- props를 분 단위로 변경 (`timeoutMinutes`, `warningMinutes`)

### 1-4. use-auth.ts 확인

`useAuth` 훅이 `updateSession`을 반환하는지 확인:

```typescript
export function useAuth(): AuthState {
  const { data: session, status, update: updateSession } = useNextAuthSession();
  // ...
  return {
    // ...
    updateSession,  // 이게 있어야 함
  };
}
```

---

## 작업 2: Auth 구조 정리

### 2-1. 파일명 변경

```bash
mv src/features/auth/handler.ts src/features/auth/next-auth.ts
```

### 2-2. import 경로 수정

**수정 대상 파일:**
- `src/features/auth/index.ts`
- `src/features/auth/utils/server.ts`

```typescript
// Before
import { auth } from './handler';

// After
import { auth } from './next-auth';
```

### 2-3. useSession → useAuth 통일

프로젝트에서 `useSession`을 직접 사용하는 곳을 찾아서 `useAuth`로 변경:

```bash
# 검색
grep -r "useSession" src/ --include="*.tsx"
```

**Before:**
```typescript
import { useSession } from 'next-auth/react';
const { data: session } = useSession();
const userName = session?.user?.name;
```

**After:**
```typescript
import { useAuth } from '@/features/auth';
const { user } = useAuth();
const userName = user?.name;
```

### 2-4. signIn/signOut import 경로 통일

```bash
# 검색
grep -r "from 'next-auth/react'" src/ --include="*.tsx"
```

**Before:**
```typescript
import { signIn } from 'next-auth/react';
```

**After:**
```typescript
import { signIn } from '@/features/auth';
```

---

## 검증

### 타입 체크

```bash
npx tsc --noEmit
```

### 테스트 (개발 환경)

빠른 테스트를 위해 짧은 시간 설정:

```typescript
// app.config.ts (테스트용)
IDLE_TIMEOUT_MINUTES: 1 / 6,    // 10초
IDLE_WARNING_MINUTES: 1 / 12,   // 5초
```

### 프로덕션 값 복원

```typescript
// app.config.ts (실제 값)
IDLE_TIMEOUT_MINUTES: 60,
IDLE_WARNING_MINUTES: 5,
```

---

## 최종 Auth 구조

```
src/features/auth/
├── next-auth.ts         # 서버 전용 (auth, nextAuthHandlers)
├── use-auth.ts          # 클라이언트 전용 (useAuth, signIn/Out re-export)
├── config.ts            # NextAuth 설정
├── utils/server.ts      # 서버 유틸 (requireAuth)
├── idle-logout-provider.tsx
└── index.ts             # 통합 export
```

---

## 체크리스트

- [ ] `app.config.ts` - `IDLE_TIMEOUT_MINUTES`, `IDLE_WARNING_MINUTES`로 변경
- [ ] `handler.ts` → `next-auth.ts` 리네이밍
- [ ] `next-auth.ts` - `maxAge` 추가, 미사용 export 제거
- [ ] `idle-logout-provider.tsx` - `updateSession` 로직 추가, 분 단위 props
- [ ] `use-auth.ts` - `updateSession` 반환 확인
- [ ] `index.ts`, `utils/server.ts` - import 경로 수정
- [ ] 모든 `useSession` → `useAuth` 변경
- [ ] 모든 `signIn/signOut` import 경로 통일
- [ ] `npx tsc --noEmit` 통과 확인
