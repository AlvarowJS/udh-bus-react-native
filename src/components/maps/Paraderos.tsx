import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import busApi from '../../api/busApi'
import { Marker } from 'react-native-maps'
import { Paradero } from '../../interfaces/paradero'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Paraderos = () => {
    const [paraderos, setParaderos] = useState<Paradero[]>()
    useEffect(() => {
        let isMounted = true;
        busApi.get('/paradero')
            .then(res => {
                setParaderos(res?.data)
            })
            .catch(error => console.log(error))

        return () =>{
          isMounted = false;
        };
    }, [])

    return (
        <View>
            {paraderos?.map((paradero: Paradero, index: number) => (
                <Marker
                    key={index}
                    coordinate={{ latitude: paradero?.latitud, longitude: paradero?.longitud }}
                    title={paradero?.titulo}
                    description={paradero?.descripccion}
                >
                    <MaterialCommunityIcons
                        name="bus-stop-covered"
                        size={40}
                        style={{
                            color: 'black',
                        }}
                    />
                </Marker>
            ))}

        </View>
    )
}

export default Paraderos