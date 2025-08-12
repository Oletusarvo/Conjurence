import db from '@/dbconfig';
import { AuthError } from '@/errors/auth';
import { tablenames } from '@/tablenames';
import { verifyPassword } from '@/util/auth/verifyPassword';
import { NextAuthOptions } from 'next-auth';
import { getAttendance } from '@/features/attendance/dal/getAttendance';
import z from 'zod';

export const options: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },

  jwt: {
    maxAge: 60 * 60 * 24,
  },

  providers: [
    {
      id: 'Credentials',
      type: 'credentials',
      name: 'credentials',

      credentials: {},
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error(AuthError.noCredentials);
          }
          const { password, email } = credentials;
          const user = await db({ u: tablenames.user })
            .join(db.select('*').from(tablenames.user_status).as('ut'), 'u.user_status_id', 'ut.id')
            .where({ email })
            .select('u.id', 'u.email', 'u.username', 'u.password', 'ut.label as status')
            .first();

          if (!user || !(await verifyPassword(password, user.password))) {
            console.log(user);
            throw new Error(AuthError.invalidCredentials);
          }

          const pr = await getAttendance(db)
            .where({
              user_id: user.id,
              attendance_status_id: db
                .select('id')
                .from(tablenames.event_attendance_status)
                .where({ label: 'host' })
                .limit(1),
              event_ended: false,
            })
            .orderBy('requested_at', 'desc')
            .first();

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            status: user.status,
            attended_event_id: pr?.event_instance_id || null,
          };
        } catch (err) {
          console.log(err.message);
          console.log('Email used: ', credentials.email);
          throw err;
        }
      },
    },
  ],

  callbacks: {
    jwt({ user, token, trigger, session }: any) {
      if (trigger === 'update' && session) {
        z.uuid().nullable().parse(session.attended_event_id);
        token.attended_event_id = session.attended_event_id;
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.status = user.status;
        token.attended_event_id = user.attended_event_id;
      }

      return token;
    },

    session({ token, session }: TODO) {
      if (token) {
        session.user = {
          id: token.id,
          username: token.username,
          email: token.email,
          attended_event_id: token.attended_event_id,
          status: token.status,
        };
      }
      return session;
    },
  },
};
