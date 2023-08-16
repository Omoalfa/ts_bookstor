import { config } from "dotenv";

config({ path: "../../.env" });

export const {
  DB_URL, DB_NAME, DB_PORT, DB_USER, DB_PASS, DB_HOST
} = process.env;
