export type CreateUserFormState = {
    status?: string;
    errors?: {
        email?: string[];
        password?: string[];
        name?: string[];
        role?: string[];
        avatar_url?: string[];
        _form?: string[];
    }
}

export type CreateUserInput = {
    email: string;
    password: string;
    name: string;
    role: string;
    avatar_url?: undefined | File | string;
}