// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      status: 'active' | 'pending' | 'deleted' | 'banned';
      joined_event_id?: string;
    };
  }
}
