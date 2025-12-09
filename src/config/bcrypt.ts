import { compareSync, genSaltSync, hashSync } from "bcryptjs";

export class BcryptAdapter {

    static hash(password: string): string {
        // const salt = genSaltSync(); could be salted with more complexity
        return hashSync(password);
    }

    static compare(password: string, hashed: string): boolean {
        return compareSync(password, hashed);
    }

}