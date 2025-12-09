import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const autorization = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    if (!autorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!Array.isArray(autorization) && !autorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
    const token = autorization.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.validateToken<{id: string}>(token);
      if (!payload) {
        return res.status(401).json({ error: "Unauthorized: Invalid Token" });
      }

      const user = await UserModel.findById(payload.id);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized: User not found" });
      }

      req.body = { ...req.body, payload, user: user };

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
