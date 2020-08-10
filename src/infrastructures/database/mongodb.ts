import { MongoClient, Db } from "mongodb";

const DB_NAME = "onion-test";
const DB_PORT = "28001";
const DB_HOST = "localhost";
const DB_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

let DB_CACHE: Db;

export const connectDb = async () => {
  if (DB_CACHE) return Promise.resolve(DB_CACHE);

  const client = new MongoClient(DB_URL, {
    useUnifiedTopology: true,
    // auth: { user: DB_USER, password: DB_PASSWORD },
  });

  await client.connect();

  DB_CACHE = client.db(DB_NAME);
  return DB_CACHE;
};
