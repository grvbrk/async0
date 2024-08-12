import { addUser, findUser } from "@/app/actions/users";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID_USER as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_USER as string,
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

      if (!user) {
        await addUser(profile.email);
      }

      return true;
    },

    // This callback will modify the session object.
    async session({ session, token }: any) {
      const user = await findUser(session.user.email);
      session.user.id = user?.id;
      session.user.foo = "bar";
      return session;
    },
  },
};
