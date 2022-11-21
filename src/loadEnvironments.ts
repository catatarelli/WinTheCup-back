import dotenv from "dotenv";

dotenv.config();

export const {
  PORT: port,
  MONGODB_URL: mongoUrl,
  JWT_SECRET: secretWord,
  DEBUG: debug,
} = process.env;
