import React, { useContext, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../../context/AuthContext';
import { HomeStudentStyle } from '../../theme/homeStudentTheme';
import { HomeDriverStyle } from '../../theme/driverHomeTheme'
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MapDriver = () => {
    const navigation = useNavigation()
    const { user, token, logOut } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <View style={HomeStudentStyle.header} >

                <Icon
                    name="person-circle-outline"
                    size={40}
                    style={HomeDriverStyle.photo}
                />
                <Text style={HomeDriverStyle.name}>
                   Bienvenido {user?.nombres}
                </Text>

            </View>
            <View>
                <TouchableOpacity activeOpacity={1}>
                    <Icon
                        name="menu"
                        size={30}
                        style={HomeDriverStyle.menu}
                        onPress={() => navigation.openDrawer()}                    
                    />
                </TouchableOpacity>
            </View>
        </>
    )
}

export default MapDriver