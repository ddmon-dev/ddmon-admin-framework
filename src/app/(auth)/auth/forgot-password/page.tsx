import { ForgotPasswordForm } from '@/features/auth';
import { AuthContainer, AuthCard } from '@/features/auth';

export default function LoginPage() {
  return (
    <AuthContainer>
      <AuthCard
        title='Forgot your password?'
        description={
          <>
            비밀번호를 잊으셨나요? <br />
            이메일을 입력하고 재설정 링크를 받으세요.
          </>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </AuthContainer>
  );
}
