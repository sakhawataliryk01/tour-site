/**
 * Edge-safe Auth.js config (no Prisma / Node APIs).
 * Used by middleware and merged into the full auth setup.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  providers: [], // filled in auth.js (Credentials needs Prisma)
  callbacks: {
    async jwt({ token, user }) {
      // No DB access here — middleware runs on Edge
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.role = token.role;
        if (token.email) session.user.email = token.email;
        if (token.name) session.user.name = token.name;
      }
      return session;
    },
  },
};
