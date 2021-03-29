import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
// import mongoose from "mongoose";

import connect from "../../../lib/database";
import Models from "../../../models/typeorm";
// import { User } from "../../../models/mongoose";

connect();

function reverseDomain(domain) {
  return domain.split(".").reverse().join(".");
}

const getProviders = (ownership, platform, codeVerifier) => {
  return [
    ownership === "expo"
      ? Providers.Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          state: false,
          params: {
            grant_type: "authorization_code",
            redirect_uri: "https://auth.expo.io/@dylanbulmer/annotator",
          },
        })
      : platform === "ios"
      ? Providers.Google({
          clientId: process.env.GOOGLE_IOS_CLIENT_ID,
          state: false,
          params: {
            grant_type: "authorization_code",
            redirect_uri: `${reverseDomain(
              process.env.GOOGLE_IOS_CLIENT_ID
            )}:/oauthredirect`,
            code_verifier: codeVerifier,
          },
        })
      : platform === "android"
      ? Providers.Google({
          clientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
          state: false,
          params: {
            grant_type: "authorization_code",
            redirect_uri: "com.bulmersolutions.annotator:/oauthredirect",
            code_verifier: codeVerifier,
          },
        })
      : Providers.Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          params: {
            grant_type: "authorization_code",
          },
        }),
  ];
};

export default function handler(req, res) {
  return NextAuth(req, res, {
    // Configure one or more authentication providers
    providers: getProviders(
      req.headers["annotator-ownership"],
      req.headers["annotator-platform"],
      req.headers["annotator-code-verifier"]
    ),
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
      error: "/login",
    },
  });
}
