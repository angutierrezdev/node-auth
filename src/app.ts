import { envs } from "./config";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(() => {
  main();
})();

async function main() {
  // todo: await base de datos;

  // todo: inicio nuestro servidor;
  console.log("App started");

  new Server({
    port: envs.port,
    routes: AppRoutes.routes,
  }).start();
}
