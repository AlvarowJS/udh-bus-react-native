import React from 'react'
import { View, Platform, Text } from 'react-native';

const Estados = () => {
  return (
    <View style={{
        backgroundColor: 'white',
        borderRadius: 5,
        width: 350,
        height: 50,
        paddingVertical: 10,
        marginBottom: 5,
        //   borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
            },
            android: {
                elevation: 5,
            },
        }),
    }}>
        <Text style={{
            color: 'black',
            textAlign: 'center'
        }}>
            Hoy no hay anteción 😔
        </Text>
    </View>  
  )
}

export default Estados