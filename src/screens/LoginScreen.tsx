import React, { useContext, useEffect, useState } from 'react'
import { Alert, Button, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableHighlight, View, Linking } from 'react-native'
import { Background } from '../components/Background'
import { WhiteLogo } from '../components/WhiteLogo'
import { loginStyles } from '../theme/loginTheme'
import { GoogleLogo } from '../components/GoogleLogo'
import { useForm } from '../hooks/useForm'
import { AuthContext } from '../context/AuthContext'
import { WebView } from 'react-native-webview'
import { statusCodes, GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { userRequest } from '../interfaces/userGoogle'
// GoogleSignin.configure({
//     webClientId: '803651617332-bjr6fkgfnlme290icjl7jg7vnoeacchu.apps.googleusercontent.com',
//     iosClientId: '<FROM DEVELOPER CONSOLE>',
// });
export const LoginScreen = () => {
    const { signIn, errorMessage, removeError, signInGoogleManual } = useContext(AuthContext);

    const { email, password, onChange } = useForm({
        email: '',
        password: ''
    })
    useEffect(() => {
        GoogleSignin.configure({
            //   webClientId: '803651617332-bjr6fkgfnlme290icjl7jg7vnoeacchu.apps.googleusercontent.com', // Obtén esto desde la consola de desarrolladores de Google
            scopes: ['email'],
            webClientId: '803651617332-3i05qlcukt69u1tssq0qfdvjk93oitsc.apps.googleusercontent.com',
            iosClientId: '803651617332-5gk0u0g9q66ph39ump0aqrfa7eug6d8t.apps.googleusercontent.com',
            offlineAccess: true,
        });
    }, []);
    useEffect(() => {
        if (errorMessage.length === 0) return;
        Alert.alert('Login Incorrecto', errorMessage, [
            {
                text: 'Ok',
                onPress: removeError
            }
        ]);

    }, [errorMessage])

    const onLogin = () => {
        console.log({ email, password })
        signIn({ email, password })
    }


    const [estado, setEstado] = useState(true)

    const cambiarEstado = () => {
        console.log("seactivo")
        setEstado(!estado)

    }


    const abrirGoogleAutentication = () => {
        console.log("click");
    };

    const signInGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            signInGoogleManual(userInfo.user)
        } catch (error: any) {
            console.log("holaaaaaa?")
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
                console.log(error)
            }
        }
    };

    const signOutGoogle = async () => {
        try {
            await GoogleSignin.revokeAccess()
            await GoogleSignin.signOut();
            console.log("se envio")
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <Background />
                <WhiteLogo />
                <View style={loginStyles.title}>
                    {
                        estado ? (
                            <Text style={loginStyles.text_active} >INGRESAR</Text>
                        ) : (
                            <Text style={loginStyles.text} onPress={cambiarEstado}>INGRESAR</Text>
                        )
                    }
                    {
                        estado ? (
                            <Text style={loginStyles.text} onPress={cambiarEstado}>REGISTRAR</Text>

                        ) : (
                            <Text style={loginStyles.text_active}>REGISTRAR</Text>
                        )
                    }

                </View>

                {
                    estado ? (
                        <View style={loginStyles.content_inputs}>
                            <TextInput
                                placeholder='correo institucional'
                                autoCorrect={false}
                                style={loginStyles.input}
                                onChangeText={(value) => onChange(value, 'email')}
                                value={email}
                                onSubmitEditing={onLogin}
                            />
                            <TextInput
                                onChangeText={(value) => onChange(value, 'password')}
                                value={password}
                                onSubmitEditing={onLogin}
                                secureTextEntry
                                placeholder='contraseña'
                                autoCapitalize='none'
                                style={loginStyles.input}
                            />
                            <Text style={loginStyles.aviso}>Su contraseña viene a ser su codigo de estudiante en todo caso puede ingresar directamente desde su cuenta institucional de Google</Text>
                        </View>
                    ) : (
                        <View>
                            <Text style={loginStyles.aviso}>Recuerda que la app es exclusiva para estudiantes de la Universidad de Huánuco</Text>
                        </View>
                    )
                }

                <View style={loginStyles.container}>
                    {
                        estado ? (
                            <View style={loginStyles.login_button}>
                                <TouchableOpacity
                                    onPress={onLogin}

                                >
                                    <Text style={loginStyles.login_buttoninfo}>Ingresar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null
                    }

                    {
                        estado ? (
                            // <View style={loginStyles.google}>                                
                            //     <GoogleLogo />
                            //     <Text>Ingresar con google</Text>
                            // </View>
                            <GoogleSigninButton
                                style={{ width: 192, height: 48 }}
                                size={GoogleSigninButton.Size.Wide}
                                color={GoogleSigninButton.Color.Dark}
                                onPress={signInGoogle}
                            />
                        ) : (
                            <>
                                {/* <WebView source={{ uri: googleLink }} /> */}
                                {/* <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ flex: 1 }} /> */}
                                {/* <TouchableOpacity
                                    style={loginStyles.google}
                                    onPress={
                                        abrirGoogleAutentication
                                    }
                                >
                                    <View>
                                        <GoogleLogo />
                                    </View>
                                    <View>
                                        <Text>Registrar con Google</Text>
                                    </View>
                                    <View>
                                        <GoogleSigninButton
                                            style={{ width: 192, height: 48 }}
                                            size={GoogleSigninButton.Size.Wide}
                                            color={GoogleSigninButton.Color.Dark}
                                            onPress={signInGoogle}
                                        />
                                    </View>

                                </TouchableOpacity> */}
                                <GoogleSigninButton
                                    style={{ width: 192, height: 48 }}
                                    size={GoogleSigninButton.Size.Wide}
                                    color={GoogleSigninButton.Color.Dark}
                                    onPress={signInGoogle}
                                />

                                {/* <View>
                                    <Button title="Sign Out with Google" onPress={signOutGoogle} />
                                </View> */}
                            </>
                        )

                    }

                </View>

            </KeyboardAvoidingView >
        </>
    )
}
