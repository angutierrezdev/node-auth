import { Router } from "express";
import { AuthController } from "./controller";
import { Container } from "../../infrastructure";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const authRepository = Container.getAuthRepository();
    const userService = Container.getUserService();
    const controller = new AuthController(authRepository, userService);
    const authMiddleware = new AuthMiddleware(userService);

    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);

    router.get("/", [authMiddleware.validateJWT], controller.getUsers);

    return router;
  }
}
