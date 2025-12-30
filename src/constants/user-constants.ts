export const USER_TABLE_HEADERS = ['No', 'ID', 'Name', 'Role', 'Actions'];
export const INITIAL_CREATE_USER_VALUE = {
    name: '',
    email: '',
    password: '',
    role: '',
    avatar_url: '',
}

export const CREATE_USER_FORM_KEY = {
    NAME: "name",
    EMAIL: "email",
    PASSWORD: "password",
    ROLE: "role",
    AVATAR_URL: "avatar_url",
}

export const INITIAL_STATE_CREATE_USER = {
    status: 'idle',
    errors: {
        name: [],
        email: [],
        password: [],
        role: [],
        avatar_url: [],
        _form: [],
    }
}