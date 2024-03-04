import { Text, Dimensions, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react'
import { sideStyles } from '../theme/sideTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { WhiteLogo } from '../components/WhiteLogo';

const Side = ({ navigation }) => {
    const { user, token, logOut } = useContext(AuthContext);
    const logOutAndCloseDrawer = () => {
        navigation.closeDrawer();
        logOut();
    };
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

            <TouchableOpacity style={sideStyles.option} onPress={logOutAndCloseDrawer}>
                <Ionicons name="exit-outline" style={sideStyles.icon} />
                <Text style={sideStyles.text}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View >
    )
}

export default Side