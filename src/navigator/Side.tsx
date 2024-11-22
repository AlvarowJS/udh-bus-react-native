import { Text, Dimensions, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react'
import { sideStyles } from '../theme/sideTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { WhiteLogo } from '../components/WhiteLogo';
import busApi from '../api/busApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
const finishedBus = '/driver/terminar-bus'

const Side = ({ navigation }) => {
    const { user, token, logOut,webSocket } = useContext(AuthContext);
    const logOutAndCloseDrawer = () => {
        navigation.closeDrawer();
        logOut();
    };

    const finishRoute = async () => {
        try {
            const response = await busApi.get(finishedBus);
            await AsyncStorage.setItem('busNumero', "");
            await AsyncStorage.setItem('busPlaca', "");
            if (webSocket){
                webSocket.close()                
            }
        } catch (err) {
            console.log(err)
        }
        navigation.navigate('HomeDriver');
    }
    return (
        <View style={sideStyles.container}>

            <Image
                source={require('../assets/bus.png')}
                style={sideStyles.logo}
            />
            <TouchableOpacity style={sideStyles.option} onPress={() => navigation.navigate('BusesList')} >
                <Ionicons name="bus-outline" style={sideStyles.icon} />
                <Text style={sideStyles.text}>Cambiar Bus</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sideStyles.option} onPress={finishRoute} >
                <Ionicons name="flag-outline" style={sideStyles.icon} />
                <Text style={sideStyles.text}>Terminar Carrera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sideStyles.option} onPress={logOutAndCloseDrawer}>
                <Ionicons name="exit-outline" style={sideStyles.icon} />
                <Text style={sideStyles.text}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View >
    )
}

export default Side