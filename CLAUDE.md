# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때의 지침입니다. 프로젝트 전반(소개·기술 스택·빠른 시작·아키텍처 개요)은 **README.md**를 정면 문서로 삼고, 이 파일은 작업에 필요한 라우팅과 규칙만 담습니다.

## 소개

Admin Framework — Next.js 16(App Router) 기반 관리자 대시보드 프레임워크. 설정 파일(`config.ts`) 하나로 목록·검색·정렬·페이지네이션·CRUD 관리 화면 전체가 돌아갑니다.

## 상세 문서 (`docs/template-guides/`)

코드나 문서를 고치기 전에 관련 주제의 문서에서 해당 섹션을 먼저 확인하세요.

| 문서 | 내용 |
| --- | --- |
| [conventions.md](docs/template-guides/conventions.md) | FSD 구조, 파일명 규칙, lib vs utils, APP_CONFIG, 공용 UI |
| [manage-modules.md](docs/template-guides/manage-modules.md) | CRUD 모듈 시스템, 핵심 패턴, 엑셀 내보내기 |
| [file-system.md](docs/template-guides/file-system.md) | FormFileUpload + 에디터(Tiptap) 이미지 업로드 |
| [auth.md](docs/template-guides/auth.md) | NextAuth 설정, 라우팅, 세션 |
| [i18n.md](docs/template-guides/i18n.md) | lang 필터, APP_CONFIG.LANG, 언어 전환 |
| [email.md](docs/template-guides/email.md) | Nodemailer 발송, 문의 답변 |
| [development.md](docs/template-guides/development.md) | 명령어, 환경변수, 설정 파일 |
| [supabase.md](docs/template-guides/supabase.md) | 로컬 개발, 마이그레이션, 배포 |

## 빠른 참조

레시피 전체 코드는 각 문서에 있습니다. 여기서는 진입점만 안내합니다.

- **새 CRUD 모듈**: 기존 모듈 복사(`faqs` 기본 / `notices` 카테고리+파일) → `schema.ts`(검증 SSOT)·`config.ts` 수정 → 서버 액션은 `_base` 액션에 `CONFIG`를 넘기는 얇은 함수. → [manage-modules.md](docs/template-guides/manage-modules.md#새로운-모듈-추가)
- **순서 변경**: `config.ts`에 `enableReorder` + `sort_order` 컬럼 마이그레이션. → [manage-modules.md](docs/template-guides/manage-modules.md#순서-변경-기능-enablereorder)
- **파일 업로드**: 첨부는 `<FormFileUpload>` + `uploadFormFiles`, 에디터 이미지는 `<FormEditor>`. → [file-system.md](docs/template-guides/file-system.md)
- **새 페이지**: `app/(protected)/<name>/page.tsx`에서 해당 feature를 import. → [conventions.md](docs/template-guides/conventions.md#새로운-기능-추가-시)

## 개발 명령어

```bash
npm run dev         # 개발 서버
npm run build       # 프로덕션 빌드
npm run lint        # ESLint
npm run type-check  # 타입 검사 (tsc --noEmit)
npm run test:run    # 테스트 (Vitest)
```

Supabase 로컬 DB(`db:start`, `db:reset`, `db:migrate:new` 등)는 [supabase.md](docs/template-guides/supabase.md#명령어) 참조.

## 컨벤션 (요약 — 상세는 [conventions.md](docs/template-guides/conventions.md))

- **파일/폴더**: kebab-case (`user-profile.tsx`). Hooks: `use-*`. 도메인 설정: `config.ts`/`types.ts`. 루트 설정: `*.config.ts`.
- **코드**: 컴포넌트 PascalCase, 함수/변수 camelCase, 상수 SCREAMING_SNAKE_CASE, 타입 PascalCase.
- **커밋**: `타입: 제목` 형식. 타입은 `feat`·`fix`·`refactor`·`docs`·`style`·`test`·`chore`.

## 프로젝트 특이사항

코드만 봐서는 드러나지 않는 결정들입니다.

- **Path Alias**: `@/*` = `./src/*`
- **React Compiler 비활성화** — 프로덕션 빌드에서 컴파일러 버그 재현 확인됨. ([development.md](docs/template-guides/development.md#react-compiler-비활성화))
- **Tailwind V4** — PostCSS 플러그인 방식
- **APP_CONFIG** (`src/app.config.ts`) — 앱 전역 설정 SSOT
- **manage-modules SSOT** — `config.ts`가 목록 UI부터 서버 액션 Zod 검증까지 구동. 서버 액션은 `_base`에 `CONFIG`를 넘기는 얇은 함수로 유지.

## 문서 규칙

- 코드 변경 시 관련 `docs/template-guides/` 문서의 예시(구조·타입·import 경로)도 함께 갱신하세요.
- **`docs/_local/`** 는 git 추적 제외 경로입니다(내부 todos·테스트 리포트 등 공개하지 않을 작업 문서). 공개용 문서는 `docs/template-guides/` 에 둡니다.
