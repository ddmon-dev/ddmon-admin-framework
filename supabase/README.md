# Supabase 템플릿

테이블별로 분리된 마이그레이션과 개발용 시드 데이터.

## 폴더 구조

```
supabase/
├── migrations/                      # 테이블별 마이그레이션
│   ├── 00000000000001_core.sql      # 필수: 공통 함수
│   ├── 00000000000002_admins.sql    # 필수: 관리자
│   ├── 00000000000003_notices.sql   # 선택: 공지사항
│   ├── 00000000000004_news.sql      # 선택: 뉴스
│   ├── 00000000000005_faqs.sql      # 선택: FAQ
│   ├── 00000000000006_inquiries.sql # 선택: 문의
│   └── 00000000000007_popups.sql    # 선택: 팝업
├── seed.sql                         # 개발용 목 데이터
├── templates/                       # 새 테이블 추가 시 참고
│   ├── faqs.sql
│   ├── inquiries.sql
│   ├── news.sql
│   ├── notices.sql
│   └── popups.sql
├── config.toml
└── README.md
```

---

## 워크플로우

### 템플릿 개발/테스트

```bash
npm run db:start
npm run db:reset      # 스키마 + 시드 자동 적용
npm run db:types:local
npm run dev
```

### 새 프로젝트 시작

```bash
# 1. 템플릿 클론
git clone <template-repo> my-project

# 2. 불필요한 테이블 제거 (예: FAQ, 팝업)
rm supabase/migrations/*_faqs.sql
rm supabase/migrations/*_popups.sql

# 3. 시드 삭제 (또는 필요한 것만 남기기)
rm supabase/seed.sql

# 4. 로컬 개발 시작
npm run db:start
npm run db:reset
npm run db:types:local
npm run dev
```

### 프로덕션 배포

```bash
npm run db:link --project-ref <project-ref>
npm run db:push       # 스키마만 적용 (시드 제외)
npm run db:types
```

---

## 마이그레이션 구조

### 필수 (삭제 금지)

| 파일 | 내용 |
|------|------|
| `00000000000001_core.sql` | `update_updated_at`, `increment_view_count` 함수 |
| `00000000000002_admins.sql` | 관리자 테이블 + 초기 계정 |

### 선택 (불필요시 삭제)

| 파일 | 내용 |
|------|------|
| `00000000000003_notices.sql` | 공지사항 (파일 첨부, 카테고리) |
| `00000000000004_news.sql` | 뉴스 (파일 첨부) |
| `00000000000005_faqs.sql` | FAQ (질문/답변) |
| `00000000000006_inquiries.sql` | 문의 + 답변 |
| `00000000000007_popups.sql` | 팝업 관리 |

---

## 시드 데이터

`seed.sql`은 개발용 목 데이터입니다.

- `db:reset` → 자동 실행
- `db:push` → 무시 (프로덕션에 적용 안됨)

**포함 내용:**
- notices 30개
- news 20개

---

## 환경변수

| 환경 | URL | 키 |
|------|-----|-----|
| 로컬 | `http://127.0.0.1:54321` | 고정값 (`.env.local.example` 참고) |
| 클라우드 | `https://<ref>.supabase.co` | 프로젝트별 |

---

## 스토리지 버킷

**로컬:** `config.toml`에서 자동 생성

**클라우드:** 콘솔에서 수동 생성 또는 SQL:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  52428800, -- 50MB
  ARRAY['image/*', 'application/pdf', 'application/zip']
);
```
