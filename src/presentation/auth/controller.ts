import { Request, Response } from "express";
import {
  AuthRepository,
  CustomError,
  LoginUser,
  LoginUserDto,
  RegisterUser,
  RegisterUserDto,
  GetUsers,
} from "../../domain";
import { UserService } from "../../domain";

export class AuthController {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService
  ) {}

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

    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((userToken) => {
        res.status(201).json(userToken);
      })
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const { error, dto: loginUserDto } = LoginUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then((userToken) => {
        res.status(200).json(userToken);
      })
      .catch((error) => this.handleError(error, res));
  };

  getUsers = (req: Request, res: Response) => {
    new GetUsers(this.userService)
      .execute()
      .then((users) => {
        res.json({
          users: users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          })),
          authenticatedUser: req.body?.user,
        });
      })
      .catch((error) => this.handleError(error, res));
  };
}
