import { LoginDriver, LoginResponse } from "../interfaces/appInterfaces";

export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticate' | 'authenticated-driver';
    token: string | null;
    errorMessage: string;
    user: LoginResponse | null | LoginDriver;
}

type AuthAction =
    | { type: 'signUp', payload: { token: string, user: LoginResponse } }
    | { type: 'signUpDriver', payload: { token: string, user: LoginDriver } }
    | { type: 'addError', payload: string }
    | { type: 'removeError' }
    | { type: 'notAuthenticated' }
    | { type: 'logout' }

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'addError':
            return {
                ...state,
                user: null,
                status: 'not-authenticate',
                token: null,
                errorMessage: action.payload
            }
        case 'removeError':
            return {
                ...state,
                errorMessage: ''
            }
        case 'signUp':
            return {
                ...state,
                errorMessage: '',
                status: 'authenticated',
                token: action.payload.token,
                user: action.payload.user,
            }
        case 'signUpDriver':
            return {
                ...state,
                errorMessage: '',
                status: 'authenticated-driver',
                token: action.payload.token,
                user: action.payload.user,
            }
        case 'logout':
        case 'notAuthenticated':
            return {
                ...state,
                status: 'not-authenticate',
                token: null,
                user: null
            }

        default:
            return state;
    }
}