import "dotenv/config";
import envVar from "env-var";

export const envs = {
  PORT: envVar.get("PORT").required().asPortNumber(),
  MONGO_URL: envVar.get("MONGO_URL").required().asString(),
  DB_NAME: envVar.get("DB_NAME").required().asString(),
};
