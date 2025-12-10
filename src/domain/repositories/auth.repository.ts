import { LoginUserDto, RegisterUserDto } from './../dtos/auth';
import { UserEntity } from "../entities";

export abstract class AuthRepository {

    abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;

    abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;

}