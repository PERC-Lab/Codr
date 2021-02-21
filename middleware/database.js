import { MongoClient } from 'mongodb';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 * https://github.com/vercel/next.js/pull/17666
 */
global.mongo = global.mongo || {};

export default async function database(req, res, next) {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGODB_URL, { useUnifiedTopology: true });
    await global.mongo.client.connect();
  }
  console.log('MongoDB Connected.');
  req.dbClient = global.mongo.client;
  req.db = global.mongo.client.db('annotator');
  return next();
}