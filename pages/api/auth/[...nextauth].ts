import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req): Promise<any> {
        const email = credentials?.email || '';
        const password = credentials?.password || '';
        if (!(email || password))
          throw new Error('Email and password are required');
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) throw new Error(`User with ${email} not found`);
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) throw new Error('Wrong password');
        return {
          ...user,
          image:
            'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
        };
      },
    }),
  ],
  secret: process.env.JWT_PRIVATE_TOKEN,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
    updateAge: 2 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session }) {
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return `${baseUrl}`;
      }
      return baseUrl;
    },
  },
});
