import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const MONGODB_URL =
  process.env.MONGODB_URL;

const client = new MongoClient(MONGODB_URL);
const db = client.db("studynook_db");

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
    transaction: false,
  }),
  secret: process.env.BETTER_AUTH_SECRET || "NGSLReB9F3qJfnoEqZ6iC2nV8BsPEHLc",
  baseURL: getBaseURL(),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    "https://*.vercel.app",
    "https://assignment-9-frontend-gamma.vercel.app",
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});