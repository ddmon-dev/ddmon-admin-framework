import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    super_admin: boolean;
  }

  interface Session {
    user: User & DefaultSession['user'];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    super_admin?: boolean;
  }
}
