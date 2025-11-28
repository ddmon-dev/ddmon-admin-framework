import NextAuth from 'next-auth';
import authConfig from './config';

export const {
  handlers: nextAuthHandlers,
  signIn: nextAuthSignIn,
  signOut: nextAuthSignOut,
  auth,
} = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});
