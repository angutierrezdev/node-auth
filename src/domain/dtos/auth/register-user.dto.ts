import { Validators } from "../../../config";

export class RegisterUserDto {

    private constructor(
        public name: string,
        public email: string,
        public password: string,
    ) {}


    static create(object: {[key: string]: any}): { error?: string; dto?: RegisterUserDto } {
        
        const { name, email, password } = object;

        if(!name) return { error: 'Missing name' };
        
        if(!email) return { error: 'Missing email' };
        if (!Validators.email.test(email)) return { error: 'Invalid email format' };

        if(!password) return { error: 'Missing password' };
        if(password.length < 6) return { error: 'Password must be at least 6 characters long' };

        const dto = new RegisterUserDto(name, email, password);
        return { dto };
    }

      
}