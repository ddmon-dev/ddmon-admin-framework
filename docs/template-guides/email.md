# 이메일 (SMTP)

Nodemailer 기반의 SMTP 이메일 발송입니다. 얇은 공용 함수(`sendEmail`) 하나로 통일하고, 각 기능(예: 문의 답변)은 제목·본문을 만들어 넘깁니다.

## 구조

```
src/shared/lib/email/
└── send-email.ts        # sendEmail({ to, subject, html }) — nodemailer transporter

src/features/manage-modules/inquiries/
├── reply-email.ts       # 답변 메일 제목/HTML 빌더 (escapeHtml 포함)
└── actions/create-reply.ts  # 답변 저장 + 메일 발송 (서버 액션)
```

## 환경변수

`.env.local`에 SMTP 접속 정보를 설정합니다.

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false          # 465 포트면 true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password # Gmail은 앱 비밀번호 사용
SMTP_FROM="ADMIN <noreply@domain.com>"
```

> Gmail은 계정 비밀번호가 아니라 **앱 비밀번호**를 발급해 `SMTP_PASS`에 사용합니다.

## 공용 함수

```typescript
// src/shared/lib/email/send-email.ts
import { sendEmail } from '@/shared/lib/email/send-email';

await sendEmail({
  to: 'user@example.com',
  subject: '제목',
  html: '<p>본문 HTML</p>',
});
```

`transporter`는 모듈 로드 시 `SMTP_*` 환경변수로 한 번 생성됩니다. `from`은 `SMTP_FROM`이 자동 적용됩니다.

## 사용 예: 문의 답변 발송

문의(`inquiries`) 모듈은 답변을 저장하면서 접수자에게 이메일을 보냅니다.

**1. 메일 빌더 (`reply-email.ts`)** — 제목과 HTML을 생성합니다. 사용자 입력은 반드시 이스케이프합니다.

```typescript
export function getReplyEmailSubject() { /* ... */ }

export function getReplyEmailHtml(params: ReplyEmailParams) {
  const name = escapeHtml(params.name);                 // XSS 방지
  const inquiryContent = escapeHtml(params.inquiryContent);
  const replyContent = escapeHtml(params.replyContent);
  return `... ${name} ... ${replyContent} ...`;
}
```

**2. 서버 액션 (`create-reply.ts`)** — 저장을 먼저 커밋하고, 발송 실패 시 보상 처리합니다.

```typescript
// 순서: insert(답변) → sendEmail → 실패 시 보상 삭제 → sent_at 갱신
const { data: reply } = await supabase.from('inquiry_replies').insert(...).select().single();

try {
  await sendEmail({
    to: inquiry.email,
    subject: getReplyEmailSubject(),
    html: getReplyEmailHtml({ name, inquiryContent, replyContent }),
  });
} catch {
  // 발송 실패 → 방금 저장한 답변을 되돌림 (부분 실패 방지)
  await supabase.from('inquiry_replies').delete().eq('id', reply.id);
  return Result.error(...);
}
```

## 보안 · 주의사항

- **HTML 인젝션 방지**: 이메일 본문에 들어가는 모든 사용자 입력(`name`, 문의/답변 내용)은 `escapeHtml`로 이스케이프합니다. 이스케이프 없이 사용자 문자열을 HTML에 넣지 마세요.
- **서버 전용**: `sendEmail`은 서버 액션/서버 코드에서만 호출합니다. `SMTP_*`는 `NEXT_PUBLIC_` 접두어가 없어 클라이언트에 노출되지 않습니다.
- **부분 실패 처리**: "저장 성공 + 발송 실패"가 사용자에게 잘못된 성공으로 보이지 않도록, 발송 실패 시 저장을 보상(rollback)하거나 상태를 분리해 기록합니다.

관련: [manage-modules.md](manage-modules.md), [개발 가이드 · 환경변수](development.md#환경변수)
