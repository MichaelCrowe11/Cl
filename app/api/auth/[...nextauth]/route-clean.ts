import NextAuth, { DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    provider?: string;
    user: {
      id?: string;
      username?: string;
    } & DefaultSession["user"]
  }
}

// Extend the built-in JWT types
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    username?: string;
    provider?: string;
    userId?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token;
        token.username = user.email || undefined;
        token.provider = account.provider;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      
      // Add user properties for client use
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  events: {
    async signIn(message) {
      console.log('CroweOS Pro IDE - User signed in:', { 
        user: message.user.email, 
        provider: message.account?.provider 
      });
    },
    async signOut(message) {
      console.log('CroweOS Pro IDE - User signed out:', { 
        user: message.session?.user?.email 
      });
    },
  },
});

export { handler as GET, handler as POST };
