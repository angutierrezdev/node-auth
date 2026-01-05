import { UserEntity } from "../../entities";
import { UserService } from "../../services";

interface GetUsersUseCase {
  execute(): Promise<UserEntity[]>;
}

export class GetUsers implements GetUsersUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(): Promise<UserEntity[]> {
    return this.userService.getAllUsers();
  }
}
