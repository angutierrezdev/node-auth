import { CustomError, UserEntity } from "../../domain";

export class UserMapper {
  static userEntityFromObject(object: { [key: string]: any }): UserEntity {
    const { id, _id, name, email, password, roles = ["USER_ROLE"] } = object;

    if (!_id && !id) {
      throw CustomError.badRequest("Missing user id");
    }

    if (!name) {
      throw CustomError.badRequest("Missing user name");
    }
    if (!email) {
      throw CustomError.badRequest("Missing user email");
    }
    if (!password) {
      throw CustomError.badRequest("Missing user password");
    }

    return new UserEntity(id || _id, name, email, password, roles);
  }
}
