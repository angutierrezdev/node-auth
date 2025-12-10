import { JwtAdapter } from "../../../config";
import { LoginUserDto } from "../../dtos";
import { UserToken } from "../../entities";
import { SignTokenFunction } from "../../entities/sign-token-function.type";
import { AuthRepository } from "../../repositories";

interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<UserToken>;
}

export class LoginUser implements LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignTokenFunction = JwtAdapter.generateToken
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
    const user = await this.authRepository.login(loginUserDto);

    const token = await this.signToken({ id: user.id }, "2h");

    if (!token) {
      throw new Error("Failed to generate token");
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
