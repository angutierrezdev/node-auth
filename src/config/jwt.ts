import jwt from "jsonwebtoken";
import { envs } from "./envs";

export class JwtAdapter {

  static async generateToken(
    payload: Object,
    duration: string = "2h"
  ): Promise<string | null> {
    return new Promise((resolve) => {
      // @ts-ignore
      jwt.sign(
        payload,
        envs.JWT_SECRET,
        { expiresIn: duration },
        (err, token) => {
          if (err) return resolve(null);
          resolve(token as string);
        }
      );
    });
  }

  static validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, envs.JWT_SECRET, (err, decoded) => {
        if (err) return resolve(null);
        resolve(decoded as T);
      });
    });
  }
}
