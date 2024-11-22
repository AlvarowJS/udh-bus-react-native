import { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { usePermissionStore } from '../store/permissions/usePermissionStore'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../navigator/Navigator';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PermissionChecker = ({ children }: PropsWithChildren) => {

    const { locationStatus, checkLocationPermission } = usePermissionStore();
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { status } = useContext(AuthContext)
    const [numberBus, setNumberBus] = useState<string | null>(null)

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                checkLocationPermission();
            }
        })

        return () => {
            subscription.remove();
        }
    }, [])

    useEffect(() => {
        checkLocationPermission();
    }, [])
    // useEffect(() => {
    const checkNumberBus = async () => {
        try {
            const numberBus = await AsyncStorage.getItem('busNumero');            

            if (numberBus) {
                setNumberBus(numberBus);
            } else {
                setNumberBus('');
            }
        } catch (error) {
            console.log("Error al obtener datos de AsyncStorage:", error);
        }
    };




    // }, [status])

    useEffect(() => {
        checkNumberBus()

        if (status === 'authenticated') {
            if (locationStatus === 'granted') {
                navigation.reset({
                    routes: [{ name: 'HomeStudent' }],
                });
            } else if (locationStatus !== 'undetermined') {
                console.log(locationStatus, "ga")
                navigation.reset({
                    routes: [{ name: 'PermissionsScreen' }],
                });
            }
        } else if (status === 'authenticated-driver') {
            if (locationStatus === 'granted') {
                if (numberBus) {
                    navigation.reset({
                        routes: [{ name: 'MapDriver' }],
                    });
                } else {
                    navigation.reset({
                        routes: [{ name: 'HomeDriver' }],
                    });
                }

            } else if (locationStatus !== 'undetermined') {
                navigation.reset({
                    routes: [{ name: 'PermissionsScreen' }],
                });
            }
        } else {
            null
        }
    }, [locationStatus, status])

    return (
        <>
            {children}
        </>
    )
}
