import { addUser, findUser } from "@/actions/users";
import { getToken } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { headers } from "next/headers";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID_ADMIN as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_ADMIN as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // This callback will be invoked on successful signin by user
    async signIn({ profile }: any) {
      const user = await findUser(profile.email);

      if (user && user.role != "ADMIN") return false;

      if (!user) {
        await addUser(profile.email);
      }

      return true;
    },

    // This callback is called whenever a user signs in (After signIn callback)
    // Changes in jwt persist across requests.
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    // This callback will modify the session object.
    // It is called after jwt callback
    // Changes in session only affect the current request.
    async session({ session }: any) {
      const user = await findUser(session.user.email);
      session.user.id = user?.id;
      session.user.role = user?.role;
      session.user.foo = "bar";
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      // If the user is not an admin, redirect to login
      if (url.startsWith(baseUrl)) {
        const token = await getToken({
          req: { headers: { cookie: headers().get("cookie") } } as any,
          secret: process.env.NEXTAUTH_SECRET,
        });
        if (token && token.role !== "ADMIN") {
          return `${baseUrl}/login`;
        }
      }

      return baseUrl;
    },
  },
};
