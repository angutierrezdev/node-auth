import { UserEntity } from "../entities";

/**
 * Domain service for user-related queries
 * This abstraction allows other layers to query users without depending on data layer
 */
export abstract class UserService {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract getAllUsers(): Promise<UserEntity[]>;
}
