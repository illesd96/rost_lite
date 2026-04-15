import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      requirePasswordChange: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;
    requirePasswordChange: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    requirePasswordChange: boolean;
  }
}
