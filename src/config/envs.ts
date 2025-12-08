import "dotenv/config";
import envVar from "env-var";

export const envs = {
  port: envVar.get("PORT").required().asPortNumber(),
};
