import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { HomeDriverStyle } from '../../theme/driverHomeTheme'
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import busApi from '../../api/busApi';
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
const asignarBus = '/driver/asignar-bus'


const BusCard = ({ item, seleccionarBus, seleccionado }) => {

    return (
        <TouchableOpacity
            onPress={() => seleccionarBus(item.id, item)}
            style={
                item.id == seleccionado ? HomeDriverStyle.busCardActive : HomeDriverStyle.busCard
            }>
            <Text style={
                item.id == seleccionado ? HomeDriverStyle.busTitleBusActive :
                    item.status == 'disponible' || item.driver_id == item.id_user_actual ? HomeDriverStyle.busTitleBusFree :
                        item.status == 'ocupado' ? HomeDriverStyle.busTitleBusBusy :
                            null
            }>Bus {item.numero}</Text>
            <Text style={
                item.id == seleccionado ? HomeDriverStyle.busSubtitleBusActive :
                    item.status == 'disponible' || item.driver_id == item.id_user_actual ? HomeDriverStyle.busSubtitleBusFree :
                        item.status == 'ocupado' ? HomeDriverStyle.busSubtitleBusBusy :
                            null

            }>{item.placa}</Text>
        </TouchableOpacity>
    );
};
const BusesList = () => {
    const navigation = useNavigation();
    const [seleccionado, setSeleccionado] = useState(null)
    const [buses, setBuses] = useState()
    const [refresh, setRefresh] = useState(false)
    const { user, token, logOut, refreshState } = useContext(AuthContext);
    // useEffect(() => {
    //     busApi.get('/driver/mostrar-bus')
    //         .then(res => {
    //             setBuses(res?.data)
    //         })
    // }, [refresh])
    useFocusEffect(
        useCallback(() => {
            busApi.get('/driver/mostrar-bus')
                .then(res => {
                    setBuses(res?.data);
                })
                .catch(err => {
                    console.log('Error fetching buses', err)

                }
                );

            return () => {
            };
        }, [refresh])
    );

    const seleccionarBus = (id, data) => {

        if (data.id_user_actual == data.driver_id) {
            setSeleccionado(id)
        } else if (data.status == 'ocupado') {
            return null
        }
        else {
            setSeleccionado(id)
        }
    }

    const comenzarCarrera = async () => {
        if (seleccionado == null) {
            return null;
        } else {
            const newData = { id: seleccionado };

            try {
                const response = await busApi.post(asignarBus, newData);
                const busData = response.data.data;
                console.log(response.data)
                console.log(response.status, 'status')
                if (response.status == 201) {
                } else {
                    await AsyncStorage.setItem('busNumero', busData.numero);
                    await AsyncStorage.setItem('busPlaca', busData.placa);
                }
                refreshState();
                setRefresh(!refresh);

                navigation.navigate('MapDriver');
            } catch (err) {
                console.log(err);
                Alert.alert('Bus ya seleccionado', 'Bus ya seleccionado por favor escoja otro.');
                setSeleccionado(null);
                setRefresh(!refresh);
            }
        }
    }
    
    return (
        <>
            <View style={HomeDriverStyle.busesback}>
                <Text style={HomeDriverStyle.busesTitle}>SELECCIONE SU BUS</Text>
                <View style={HomeDriverStyle.busesCollection}>

                    <FlatList
                        data={buses}
                        renderItem={({ item }) => <BusCard
                            item={item}
                            seleccionarBus={seleccionarBus}
                            seleccionado={seleccionado}
                        />}
                        keyExtractor={item => item.id}
                        columnWrapperStyle={{ flexWrap: 'wrap' }}
                        numColumns={2}
                    >

                    </FlatList>
                    <Icon
                        onPress={() => comenzarCarrera()}
                        name="play-circle"
                        size={50}
                        style={HomeDriverStyle.busPlayGreen}
                    />
                </View>
                <MaterialCommunityIcons
                    name="logout"
                    size={30}
                    style={HomeDriverStyle.logout}
                    onPress={logOut}
                />
            </View>

        </>
    )
}

export default BusesList