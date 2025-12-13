import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/drive.file", // read/write their files created by your app
            "https://www.googleapis.com/auth/drive", // full Drive access (if needed)
          ].join(" "),
          access_type: "offline",
          prompt: "consent", // ensures refresh_token on every login
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Initial login → store tokens
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = Date.now() + (account as any).expires_in * 1000;
      }

      // Access token expired → refresh it
      if (Date.now() > (token as any).expires_at) {
        const refreshed = await refreshAccessToken(token);
        return { ...token, ...refreshed };
      }

      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.access_token;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

// Helper: refresh access token
async function refreshAccessToken(token: any) {
  const url = "https://oauth2.googleapis.com/token";

  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    grant_type: "refresh_token",
    refresh_token: token.refresh_token,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });

  const data = await res.json();

  return {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
}
