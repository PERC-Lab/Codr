import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

import Models from "../../../models";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      params: {
        grant_type: "authorization_code",
      },
    }),
  ],
  adapter: Adapters.TypeORM.Adapter(
    // The first argument should be a database connection string or TypeORM config object
    process.env.MONGODB_URL,
    // The second argument can be used to pass custom models and schemas
    {
      models: {
        User: Models.User,
      },
    }
  ),
  secret: process.env.SECRET,
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,
  },
  debug: true,
  callbacks: {
    // user => database,  account => google info,  profile => google profile.
    async signIn(user, account, profile) {
      console.log(user);
      console.log(account);
      console.log(profile);

      // is the user apart of a group?
      const isAssignedMember = false;

      // is the user a sys admin, assigned by environment veriables?
      const isSysAdmin = !!process.env.SYSADMIN_EMAIL;

      if (isAssignedMember) {
        return true;
      } else if (isSysAdmin) {
        // if this is called, run first-time setup.

        // create account

        // create user
        let u = profile;
        delete profile.id;
        delete profile.locale;
        u.role = "admin";
        User.create(u);

        return true;
      } else {
        return false;
      }
    },
  },
});
