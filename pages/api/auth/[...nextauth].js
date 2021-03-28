import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
// import mongoose from "mongoose";

import connect from "../../../lib/database";
import Models from "../../../models/typeorm";
// import { User } from "../../../models/mongoose";

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
  pages: {
    error: '/login'
  },
});
