import { UserService } from "../../domain/services";
import { UserEntity } from "../../domain/entities";
import { UserModel } from "../../data/mongodb";
import { UserMapper } from "../mappers";

/**
 * Infrastructure implementation of UserService
 * This is where we interact with MongoDB
 * Domain layer depends on abstraction, not this implementation
 */
export class UserServiceImpl extends UserService {
  async findById(id: string): Promise<UserEntity | null> {
    const user = await UserModel.findById(id);
    
    if (!user) {
      return null;
    }

    return UserMapper.userEntityFromObject(user);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await UserModel.find();
    
    return users.map((user) => UserMapper.userEntityFromObject(user));
  }
}
