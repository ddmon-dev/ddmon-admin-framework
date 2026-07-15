import nodemailer from 'nodemailer';
import { IS_DEMO } from '@/shared/lib/demo';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  // 데모 모드에서는 실제 발송을 스킵한다 (호출부 흐름은 정상 성공 처리 → '발송됨' 유지)
  if (IS_DEMO) {
    console.info('[demo] 이메일 발송 스킵:', { to, subject });
    return;
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}
