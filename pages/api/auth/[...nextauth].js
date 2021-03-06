import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import mongoose from "mongoose";

import connect from "../../../lib/database";
import Models from "../../../models/typeorm";
import { User } from "../../../models/mongoose";

connect();

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
    jwt: true,
  },
  callbacks: {
    // user => database/prototype,  account => google info,  profile => google profile.
    async signIn(user, account, profile) {
      // is the user apart of a group?
      const isAssignedMember = false;

      // does the user exist in the db?
      const isUser = !!(await User.findOne({email: user.email}).exec());

      // is the user a sys admin, assigned by environment veriables?
      const isSysAdmin = process.env.SYSADMIN_EMAIL == user.email;

      if (isUser || isAssignedMember) {
        return true;
      } else if (isSysAdmin) {
        return true;
      } else {
        return "/login";
      }
    },
    // add full user to session.
    async session(session, user) {
      // console.log(session);

      // deep copy user and remove sensitive/unwanted properties.
      let u = {...user};
      // delete u.id
      // delete u.createdAt
      // delete u.updatedAt

      // update user.
      session.user = u;

      // send it off.
      return session
    },
  },
  pages: {
    // error: '/login'
  },
});
