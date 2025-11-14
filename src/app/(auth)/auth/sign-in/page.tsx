import { SignInForm } from '@/features/auth';
import { AuthContainer, AuthCard } from '@/features/auth';

export default function LoginPage() {
  return (
    <AuthContainer>
      <AuthCard
        title='Welcome back!'
        description='관리자님, 다시 만나서 반가워요!'
      >
        <SignInForm />
      </AuthCard>
    </AuthContainer>
  );
}
