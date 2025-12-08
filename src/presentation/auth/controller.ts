import { Request, Response } from "express";

export class AuthController {
  constructor() {}

  registerUser = (req:  Request, res: Response) => {
    res.json('registerUser Controller');
  };

  loginUser = (req:  Request, res: Response) => {
    res.json('loginUser Controller');
  };
}
