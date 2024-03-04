import React from 'react'
import { Image, View } from 'react-native'

export const WhiteLogo = () => {
    return (
        <View style={{
            alignItems: 'center',
            right: -100,
            top: 110
        }}>
            <Image
                source={require('../assets/bus.png')}
                style={{
                    width: 210,
                    height: 210,
                    backgroundColor: 'white',
                    borderRadius: 200,
                }}
            />
        </View>
    )
}
