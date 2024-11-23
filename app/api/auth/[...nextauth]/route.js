// app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/gmail.send',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


import { sendVerificationRequest } from "@/lib/utils";

export const { handlers, auth } = NextAuth({
  adapter,
  providers: [
    {
      id: "http-email",
      name: "Email",
      type: "email",
      maxAge: 60 * 60 * 24, // El enlace de verificación expira en 24 horas
      sendVerificationRequest,
    },
  ],
});
