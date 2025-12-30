export const INITIAL_LOGIN_VALUES = {
    email: "",
    password: "",
};

export const INITIAL_STATE_LOGIN_FORM = {
    status: 'idle',
    errors: {
        email: [],
        password: [],
        _form: [],
    }
}

export const LOGIN_FORM_KEY = {
    EMAIL: "email",
    PASSWORD: "password",
}

export const INITIAL_STATE_PROFILE = {
    id: '',
    name: '',
    role: '',
    avatar_url: '',
}