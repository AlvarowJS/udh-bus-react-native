// Generated by https://quicktype.io
export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token:  string;
    name: string;
    email:  string;
    codigo: string;
    avatar?: string;
}
export interface LoginDriver {
    token: string;
    nombres: string;
    apellidos: string;
}