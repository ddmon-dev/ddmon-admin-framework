import type { NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { createServerClient } from '@/shared/lib/supabase/server';
import { verifyPassword } from './utils/password';
import { ADMIN_TABLE_NAME, AUTH_PATHS } from './constants';
import { transformSnakeToCamel } from '@/shared/utils/objects';

const signInSchema = z.object({
  id: z.string().min(1, '아이디를 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        // 사용자 입력값 검증
        const validatedFields = signInSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { id, password } = validatedFields.data;

        try {
          // DB에서 관리자 조회
          const supabase = createServerClient();

          const { data, error } = await supabase
            .from(ADMIN_TABLE_NAME)
            .select('*')
            .eq('id', id)
            .eq('deleted', false)
            .single();

          if (error || !data) {
            return null;
          }

          const admin = transformSnakeToCamel(data);

          // 비밀번호 검증
          const isPasswordValid = await verifyPassword(password, admin.password);

          if (!isPasswordValid) {
            return null;
          }

          // 사용자 정보 반환 (JWT 토큰에 저장)
          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            superAdmin: admin.superAdmin ?? false,
          } satisfies User;
        } catch (error) {
          console.error('로그인 에러:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: AUTH_PATHS.SIGN_IN,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.superAdmin = user.superAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id!;
      session.user.name = token.name!;
      session.user.email = token.email!;
      session.user.superAdmin = token.superAdmin!;
      return session;
    },
  },
} satisfies NextAuthConfig;
