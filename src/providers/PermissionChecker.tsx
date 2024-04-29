import { PropsWithChildren, useContext, useEffect } from 'react'
import { AppState } from 'react-native'
import { usePermissionStore } from '../store/permissions/usePermissionStore'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../navigator/Navigator';
import { AuthContext } from '../context/AuthContext';

export const PermissionChecker = ({ children }: PropsWithChildren) => {

    const { locationStatus, checkLocationPermission } = usePermissionStore();
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { status } = useContext(AuthContext)

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

    useEffect(() => {
        console.log(status, "gaalos")
        if(status === 'authenticated'){
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
        }else if (status === 'authenticated-driver'){
            if (locationStatus === 'granted') {
                navigation.reset({
                    routes: [{ name: 'MapDriver' }],
                });
            } else if (locationStatus !== 'undetermined') {
                console.log(locationStatus, "ga")
                navigation.reset({
                    routes: [{ name: 'PermissionsScreen' }],
                });
            }
        }else {
            null
        }
        // if (locationStatus === 'granted') {
        //     navigation.reset({
        //         routes: [{ name: 'MapDriver' }],
        //     });
        // } else if (locationStatus !== 'undetermined') {
        //     console.log(locationStatus, "ga")
        //     navigation.reset({
        //         routes: [{ name: 'PermissionsScreen' }],
        //     });
        // }
    }, [locationStatus, status])

    return (
        <>
            {children}
        </>
    )
}
