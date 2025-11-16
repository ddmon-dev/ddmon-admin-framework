import { SignupForm } from '@/features/auth/ui/sign-up-form';
import { AuthContainer, AuthCard } from '@/features/auth/ui/auth-layout';

export default function LoginPage() {
  return (
    <AuthContainer>
      <AuthCard
        title='Welcome back!'
        description='관리자님, 다시 만나서 반가워요!'
      >
        <SignupForm />
      </AuthCard>
    </AuthContainer>
  );
}
