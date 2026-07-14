# Admin Framework

> Next.js 16 기반의 **관리자 대시보드 프레임워크**. `config.ts` 하나로 CRUD 모듈을 조립하는 convention-over-configuration 설계.

[![CI](https://github.com/ddmon-dev/ddmon-admin-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/ddmon-dev/ddmon-admin-framework/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%2017-3ecf8e)

---

## 무엇인가

관리자 페이지에서 반복되는 **목록·검색·정렬·페이지네이션·생성/수정/삭제**를 프레임워크로 추상화한 프로젝트입니다. 새 관리 화면 하나를 만드는 데 필요한 것은 대부분 스키마 하나(`schema.ts`)와 설정 하나(`config.ts`)이며, 나머지는 `_base` 공통 인프라가 처리합니다.

```typescript
// 새 모듈의 전부에 가까운 것 — config.ts
export const CONFIG = {
  tableName: 'products',
  searchFields: ['name', 'description'],
  schema: writeSchema,        // 서버 액션이 이 스키마로 자동 검증
  enableReorder: true,        // 순서 변경 UI 자동 활성화
  enableBulkAction: true,     // 일괄 선택/삭제
} as const;
```

이 한 줄짜리 설정이 목록 테이블, 검색바, 페이지네이션, 다국어 필터, 시트 기반 폼, 순서 변경 버튼, 서버 측 Zod 검증까지 연결합니다.

## 핵심 기능

- **manage-modules CRUD 시스템** — `_base` 공통 인프라 + 모듈별 얇은 설정. 기존 모듈 복사 후 `config.ts`만 고치면 새 관리 화면 완성.
- **타입 안전 체인** — Supabase 생성 타입 → `RowData<T>` → `ItemDTO<T>`. 스키마 하나(Zod)가 서버 검증 + 클라이언트 폼 + 부분 업데이트를 모두 구동(SSOT).
- **다국어(i18n)** — 행-당-언어 모델. `?lang=` 필터로 언어 전환, 언어별 순서 관리. ([가이드](docs/template-guides/i18n.md))
- **파일 시스템** — Presigned URL로 클라이언트가 Storage에 직접 업로드(서버 액션 본문 경유 X), 한글 파일명 지원, 삭제 시 Storage 정리. 에디터 이미지 업로드 포함. ([가이드](docs/template-guides/file-system.md))
- **인증** — NextAuth v5(Credentials), layout 단위 가드, 슈퍼 관리자 분리, 유휴 자동 로그아웃, 계정 열거 방지. ([가이드](docs/template-guides/auth.md))
- **엑셀 내보내기 / 이메일(SMTP)** — 목록 → 스타일 적용 `.xlsx`, Nodemailer 기반 문의 답변 발송(HTML 이스케이프 포함).
- **보안 경계** — 클라이언트는 Supabase에 직접 접근하지 않습니다. 모든 DB/Storage 접근은 service_role 서버 클라이언트를 통해서만 이뤄지고, 전역 보안 헤더와 색인 차단이 기본 적용됩니다.

## 기술 스택

| 분야 | 기술 |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, Shadcn UI (New York) |
| Language | TypeScript (strict) |
| Validation | Zod v4 + React Hook Form |
| Database | Supabase (Postgres 17, Storage) |
| Auth | NextAuth v5 (Credentials) |
| Table | TanStack Table |
| Editor | Tiptap 3 |
| Email / Excel | Nodemailer / xlsx-js-style |
| Test | Vitest + Testing Library |

> 정확한 버전은 [`package.json`](package.json)이 기준입니다.

## 빠른 시작

**사전 준비**: Node.js 24.x, [Supabase CLI](https://supabase.com/docs/guides/cli)(로컬 DB 실행용, Docker 필요)

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.local.example .env.local   # 로컬 기본값이 채워져 있음

# 3. 로컬 Supabase 시작 (Postgres + Storage)
npm run db:start

# 4. 스키마 + 시드 + 스토리지 버킷 적용
npm run db:reset

# 5. 개발 서버
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속 후 시드 기본 계정으로 로그인합니다(계정 정보는 `supabase/migrations/00000000000002_admins.sql` 참고, 운영 배포 시 반드시 변경).

시드에는 공지/뉴스/FAQ/문의/팝업 목 데이터와 다국어(`ko`+`en`) 데모가 포함되어 언어 전환 UI를 바로 확인할 수 있습니다.

## 아키텍처

**FSD(Feature-Sliced Design)** 를 손으로 지킨 레이어 구조입니다.

```
src/
├── app/            # 라우팅 (App Router)
├── features/       # 기능 (auth, dashboard, manage-modules, ui)
├── shared/         # 공유 (ui, lib, utils, hooks, schemas, ...)
├── fonts/          # 폰트 정의
└── app.config.ts   # APP_CONFIG — 앱 전역 설정 SSOT
```

핵심은 `features/manage-modules/_base`가 제공하는 프레임워크 표면과, 각 모듈이 그 위에 얹는 얇은 설정의 조합입니다. 자세한 설계는 아래 문서를 참고하세요.

| 문서 | 내용 |
| --- | --- |
| [프로젝트 구조 & 컨벤션](docs/template-guides/conventions.md) | FSD, 파일명 규칙, APP_CONFIG, 공용 UI |
| [manage-modules](docs/template-guides/manage-modules.md) | CRUD 시스템 핵심 패턴, 엑셀 내보내기 |
| [파일 시스템](docs/template-guides/file-system.md) | Presigned 업로드, 에디터 이미지 |
| [인증](docs/template-guides/auth.md) | NextAuth 설정, 가드, 세션 |
| [다국어](docs/template-guides/i18n.md) | lang 필터, 언어 전환 |
| [이메일](docs/template-guides/email.md) | SMTP 발송, 문의 답변 |
| [Supabase 워크플로우](docs/template-guides/supabase.md) | 로컬 개발, 마이그레이션, 배포 |
| [개발 가이드](docs/template-guides/development.md) | 명령어, 환경변수, 설정 파일 |

## 개발

```bash
npm run dev         # 개발 서버
npm run build       # 프로덕션 빌드
npm run lint        # ESLint
npm run type-check  # 타입 검사 (tsc --noEmit)
npm run test:run    # 테스트 (Vitest)
```

Supabase 로컬 DB 명령어(`db:reset`, `db:migrate:new` 등)는 [supabase.md](docs/template-guides/supabase.md#명령어)를 참고하세요.

**CI** — `push`/`pull_request`(main, dev) 시 GitHub Actions에서 `lint` · `type-check` · `test:run`을 실행합니다(Node 24).

## 라이선스

개인 프레임워크 프로젝트로 별도 라이선스를 부여하지 않습니다(All rights reserved).
