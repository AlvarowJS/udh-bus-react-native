import React, { Children, createContext, useEffect, useReducer, useState } from "react";
import { LoginData, LoginDriver, LoginResponse } from "../interfaces/appInterfaces";
import { AuthState, authReducer } from "./authReducer";
import busApi from "../api/busApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userRequest } from "../interfaces/userGoogle";
import { statusCodes, GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: LoginResponse;
    userDriver: LoginDriver;
    status: 'checking' | 'authenticated' | 'not-authenticate' | 'authenticated-driver';
    signUp: () => void;
    signIn: (LoginData: LoginData) => void;
    signInGoogleManual: (data: userRequest) => void;
    logOut: () => void;
    logOutGoogle: () => void;
    removeError: () => void;

}

const authInicialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

// useEffect(() => {
GoogleSignin.configure({
    //   webClientId: '803651617332-bjr6fkgfnlme290icjl7jg7vnoeacchu.apps.googleusercontent.com', // Obtén esto desde la consola de desarrolladores de Google
    scopes: ['email'],
    webClientId: '803651617332-3i05qlcukt69u1tssq0qfdvjk93oitsc.apps.googleusercontent.com',
    iosClientId: '803651617332-5gk0u0g9q66ph39ump0aqrfa7eug6d8t.apps.googleusercontent.com',
    offlineAccess: true,
});
// }, []);

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, authInicialState);

    useEffect(() => {
        checkToken()
    }, [])

    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token')

        // No hay token
        if (!token) return dispatch({ type: 'notAuthenticated' })
        // hay token
        const resp = await busApi.get('/auth');
        if (resp.status !== 200) {
            return dispatch({ type: 'notAuthenticated' });
        }

        await AsyncStorage.setItem('token', resp.data.token);

        if (resp?.data?.table == 'users') {

            dispatch({
                type: 'signUp',
                payload: {
                    token: resp.data.token,
                    user: resp.data
                }
            });
        } else {
            dispatch({
                type: 'signUpDriver',
                payload: {
                    token: resp.data.token,
                    user: resp.data
                }
            });
        }
    }

    const signIn = async ({ email, password }: LoginData) => {

        try {
            const regex = /@udh\.edu\.pe$/;
            if (!regex.test(email)) {

                const { data } = await busApi.post<LoginDriver>('/driver/login', {
                    email, password
                });

                dispatch({
                    type: 'signUpDriver',
                    payload: {
                        token: data.token,
                        user: data
                    }
                })
                await AsyncStorage.setItem('token', data.token)

            } else {
                const { data } = await busApi.post<LoginResponse>('/login-user', { email, password })

                dispatch({
                    type: 'signUp',
                    payload: {
                        token: data.token,
                        user: data,
                    }
                })
                await AsyncStorage.setItem('token', data.token)
            }

        } catch (error: any) {
            let errorMessage = 'Información Incorrecta';
            if (error.response && error.response.data && error.response.data.msg) {
                errorMessage = error.response.data.msg;
            }
            dispatch({
                type: 'addError',
                payload: errorMessage
            })
        }
    };
    const signInGoogleManual = async ({ name, email, photo, id }: userRequest) => {
        try {
            const { data } = await busApi.post<LoginResponse>('/google-register', {
                name, email, photo, id
            });
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data
                }
            });
            await AsyncStorage.setItem('token', data.token);
        } catch (error: any) {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            let errorMessage = 'Error al iniciar sesión con Google';
            if (error.response && error.response.data && error.response.data.msg) {
                errorMessage = error.response.data.msg;

            }
            dispatch({
                type: 'addError',
                payload: errorMessage
            });
        }
    };

    const signUp = () => { };
    const logOut = async () => {     
        console.log("deslogueo")
        await busApi.get('/driver/terminar-bus');

        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' })
    };

    const logOutGoogle = async () => {
        await AsyncStorage.removeItem('token');
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        }
        catch (error) {
            console.log(error)
        }
        dispatch({ type: 'logout' })
        console.log("todobien")

    }

    const removeError = () => {
        dispatch({ type: 'removeError' })
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            logOutGoogle,
            signInGoogleManual,
            removeError
        }}>
            {children}
        </AuthContext.Provider>
    )
}