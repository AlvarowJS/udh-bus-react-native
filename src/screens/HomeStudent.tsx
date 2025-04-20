import React, { useContext } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../context/AuthContext';
import { HomeStudentStyle } from '../theme/homeStudentTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { MapScreenStudent } from '../components/maps/MapScreenStudent';
import { useLocationStore } from '../store/location/useLocationStore';


const HomeStudent = () => {
  const { user, token, logOut, logOutGoogle } = useContext(AuthContext);  
  
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
          onPress={logOutGoogle}
        />                  
      </View>
      
     
      <MapScreenStudent
      />
     <View>
     <MaterialCommunityIcons
          name="logout"
          size={20}
          style={{marginLeft: 30}}
          // style={HomeStudentStyle.logout}
          onPress={logOutGoogle}
        />   
      </View>
    </>
  )
}

export default HomeStudent