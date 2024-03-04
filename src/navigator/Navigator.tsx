import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { AuthContext } from '../context/AuthContext';
import HomeStudent from '../screens/HomeStudent';
import HomeDriver from '../screens/Driver/HomeDriver';
import BusesList from '../screens/Driver/BusesList';
import MapDriver from '../screens/Driver/MapDriver';

const Stack = createStackNavigator();

export const Navigator = () => {

  const { status } = useContext(AuthContext)


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {
        (status !== 'authenticated' && status !== 'authenticated-driver')
          ? (
            <Stack.Screen name="LoginScreen" component={LoginScreen} />

          ) : (
            (status == 'authenticated')
              ? (
                <Stack.Screen name="HomeStudent" component={HomeStudent} />
              ) : (
                <>
                  <Stack.Screen name="HomeDriver" component={HomeDriver} />
                  <Stack.Screen name="BusesList" component={BusesList} />
                  <Stack.Screen name="MapDriver" component={MapDriver} />
                </>
              )
          )
      }
    </Stack.Navigator>
  );
}