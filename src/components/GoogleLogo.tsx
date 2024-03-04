import React from 'react'
import { Image, View } from 'react-native'

export const GoogleLogo = () => {
    return (
        <View style={{           
        }}>
            <Image
                source={require('../assets/google.png')}
                style={{
                    width: 25,
                    height: 25,
                }}
            />
        </View>
    )
}
