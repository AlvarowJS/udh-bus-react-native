import React, { useContext } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../context/AuthContext';
import { HomeStudentStyle } from '../theme/homeStudentTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';


const HomeStudent = () => {
  const { user, token, logOut } = useContext(AuthContext);
  // const words = user?.name?.split(' ');
  // const firstTwoWords = words?.slice(0, 2);
  // const displayName = firstTwoWords?.join(' ');
  return (
    <>
      <View style={HomeStudentStyle.header} >
        <Image
          source={{ uri: user?.avatar }}
          style={HomeStudentStyle.photo}
        />
        <Text style={HomeStudentStyle.name}>
          {user?.name.split(' ').slice(0, 2).join(' ')}
        </Text>

      </View>
      <View>
        <MaterialCommunityIcons
          name="logout"
          size={20}
          style={HomeStudentStyle.logout}
          onPress={logOut}
        />

      </View>
    </>
  )
}

export default HomeStudent