import { AuthRepository, AuthDatasource, UserService } from "../../domain";
import { AuthMongoDatasourceImpl, AuthRepositoryImpl, UserServiceImpl } from "../index";

/**
 * Service Locator / Dependency Injection Container
 * Centralizes instantiation of infrastructure and application services
 * Follows Clean Architecture by keeping all instantiation in infrastructure layer
 */
export class Container {
  private static authDatasource: AuthDatasource;
  private static authRepository: AuthRepository;
  private static userService: UserService;

  /**
   * Initializes all services (called once at application startup)
   */
  static initialize(): void {
    this.authDatasource = new AuthMongoDatasourceImpl();
    this.authRepository = new AuthRepositoryImpl(this.authDatasource);
    this.userService = new UserServiceImpl();
  }

  /**
   * Returns the AuthRepository instance
   * All presentation and use-case layers should depend on this method
   */
  static getAuthRepository(): AuthRepository {
    if (!this.authRepository) {
      throw new Error(
        "Container not initialized. Call Container.initialize() before requesting services."
      );
    }
    return this.authRepository;
  }

  /**
   * Returns the AuthDatasource instance (if needed in other layers)
   */
  static getAuthDatasource(): AuthDatasource {
    if (!this.authDatasource) {
      throw new Error(
        "Container not initialized. Call Container.initialize() before requesting services."
      );
    }
    return this.authDatasource;
  }

  /**
   * Returns the UserService instance
   * Used by middleware and other layers needing user queries
   */
  static getUserService(): UserService {
    if (!this.userService) {
      throw new Error(
        "Container not initialized. Call Container.initialize() before requesting services."
      );
    }
    return this.userService;
  }
}
