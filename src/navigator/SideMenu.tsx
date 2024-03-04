import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import { Navigator } from './Navigator';
import Menu from '../screens/Driver/Menu';
import { useWindowDimensions } from 'react-native';
import Side from './Side';

const Drawer = createDrawerNavigator();

export const SideMenu = () => {
    const { width } = useWindowDimensions();
    return (
        <Drawer.Navigator
            drawerType={width >= 400 ? 'permanent' : 'front'}
            drawerContent={(props) => <Side {...props} />}
            // options={{ headerShown: false }}
            screenOptions={{ // Asegúrate de usar screenOptions para aplicar a todas las pantallas
                headerShown: false,
                swipeEnabled: false, // Esto desactiva la opción de abrir el drawer deslizando
            }}
        >
            <Drawer.Screen name='Navigator' options={{ headerShown: false }} component={Navigator} />
        </Drawer.Navigator>
    )
}
