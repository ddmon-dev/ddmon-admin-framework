import { APP_CONFIG } from '@/app.config';
import type { NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { createServerClient } from '@/shared/lib/supabase/server';
import { verifyPassword } from './utils/password';

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
            .from(APP_CONFIG.AUTH.ADMIN_TABLE_NAME)
            .select('*')
            .eq('id', id)
            .eq('deleted', false)
            .single();

          if (error || !data) {
            return null;
          }

          // 비밀번호 검증
          const isPasswordValid = await verifyPassword(password, data.password);

          if (!isPasswordValid) {
            return null;
          }

          // 사용자 정보 반환 (JWT 토큰에 저장)
          return {
            id: data.id,
            name: data.name,
            email: data.email,
            super_admin: data.super_admin ?? false,
          } satisfies User;
        } catch (error) {
          console.error('로그인 에러:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: APP_CONFIG.AUTH.PATHS.SIGN_IN,
    signOut: APP_CONFIG.AUTH.PATHS.SIGN_IN,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 로그인 시
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.super_admin = user.super_admin;
      }

      // updateSession() 호출 시
      if (trigger === 'update' && session) {
        token.name = session.name ?? token.name;
        token.email = session.email ?? token.email;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id!;
      session.user.name = token.name!;
      session.user.email = token.email!;
      session.user.super_admin = token.super_admin!;
      return session;
    },
  },
} satisfies NextAuthConfig;
