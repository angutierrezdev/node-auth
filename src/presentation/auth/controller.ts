import { Request, Response } from "express";
import { AuthRepository, CustomError, RegisterUserDto } from "../../domain";

export class AuthController {
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(error); // use Winston or another logger in real projects
    return res.status(500).json({ error: 'Internal Server Error' });
  };

  registerUser = (req:  Request, res: Response) => {
    const {error, dto: registerUserDto } = RegisterUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    this.authRepository.register(registerUserDto!)
        .then(user => res.json(user))
        .catch(error => this.handleError(error, res));
  };

  loginUser = (req:  Request, res: Response) => {
    res.json('loginUser Controller');
  };
}
