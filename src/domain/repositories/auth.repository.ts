import { RegisterUserDto } from './../dtos/auth/register-user.dto';
import { UserEntity } from "../entities";

export abstract class AuthRepository {

    // TODO:
    // abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;

    abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;

}