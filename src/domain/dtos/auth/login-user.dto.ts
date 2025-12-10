import { Validators } from "../../../config";

export class LoginUserDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(object: { [key: string]: any }): {
    error?: string;
    dto?: LoginUserDto;
  } {
    const { email, password } = object;

    if (!email) return { error: "Missing email" };

    if (!Validators.email.test(email)) return { error: "Invalid email format" };

    if (!password) return { error: "Missing password" };

    const dto = new LoginUserDto(email, password);
    return { dto };
  }
}
