import { RegisterUserDto } from "../../dtos";
import { AuthRepository } from "../../repositories";
import { JwtAdapter } from "../../../config";
import { CustomError } from "../../errors";
import { UserToken } from "../../entities";
import { SignTokenFunction } from "../../entities/sign-token-function.type";

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignTokenFunction = JwtAdapter.generateToken
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    const user = await this.authRepository.register(registerUserDto);

    const token = await this.signToken({ id: user.id }, "2h");

    if (!token) {
      throw CustomError.internalServerError("Failed to generate token");
    }

    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
