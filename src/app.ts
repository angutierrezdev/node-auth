import { envs } from "./config";
import { MongoDatabase } from "./data/mongodb";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { Container } from "./infrastructure";

(() => {
  main();
})();

async function main() {
  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.DB_NAME,
  });

  // Initialize dependency injection container
  Container.initialize();

  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  }).start();

  console.log("App started");
}
