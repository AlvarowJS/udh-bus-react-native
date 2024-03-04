import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { HomeDriverStyle } from '../../theme/driverHomeTheme'
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const HomeDriver = () => {
    const navigation = useNavigation();
    const { userDriver, token, logOut } = useContext(AuthContext);
    return (
        <>

            <View style={HomeDriverStyle.container}>
                <View style={HomeDriverStyle.perfil}>
                    <Text style={HomeDriverStyle.bienvenido}>
                        Hola, Bienvenido
                    </Text>
                    <Icon
                        name="person-circle-outline"
                        size={100}
                        style={HomeDriverStyle.person}
                    />
                    <Text style={HomeDriverStyle.nombre}>
                        {userDriver?.nombres}
                    </Text>
                    <Text style={HomeDriverStyle.bienvenido}>
                        Dale click para iniciar
                    </Text>
                    <Icon
                        onPress={() => navigation.navigate('BusesList' as never)}
                        name="play-circle"
                        size={50}
                        style={HomeDriverStyle.person}
                    />
                </View>
                <MaterialCommunityIcons
                    name="logout"
                    size={30}
                    style={HomeDriverStyle.logout}
                />
            </View>
        </>
    )
}

export default HomeDriver