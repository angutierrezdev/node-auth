import { Request, Response } from "express";
import { AuthRepository, CustomError, RegisterUserDto } from "../../domain";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(error); // use Winston or another logger in real projects
    return res.status(500).json({ error: "Internal Server Error" });
  };

  registerUser = (req: Request, res: Response) => {
    const { error, dto: registerUserDto } = RegisterUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    this.authRepository
      .register(registerUserDto!)
      .then(async (user) => {
        res.json({
          user,
          token: await JwtAdapter.generateToken({ id: user.id }),
        });
      })
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    res.json("loginUser Controller");
  };

  getUsers = (req: Request, res: Response) => {
    UserModel.find()
      .then((users) => {
        res.json({ users, user: req.body?.user });
      })
      .catch((error) => this.handleError(error, res));
  };
}
