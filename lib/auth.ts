import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        login: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null;
        const login = credentials.login as string;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, login))
          .limit(1);
        const userByName = !user
          ? (await db.select().from(users).where(eq(users.name, login)).limit(1))[0]
          : null;
        const found = user || userByName;
        if (!found) return null;
        const valid = await bcrypt.compare(credentials.password as string, found.password);
        if (!valid) return null;
        return { id: String(found.id), name: found.name, email: found.email, image: found.image };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
