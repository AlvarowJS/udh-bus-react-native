import { Image, Pressable, StyleSheet, Text, View, Platform } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Location } from "../../interfaces/location";
import { getCurrentLocation } from "../../actions/location/location";
import { FAB } from "../ui/FAB";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useLocationStore } from "../../store/location/useLocationStore";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from "@react-navigation/native";
import Paraderos from "./Paraderos";
import Estados from "./Estados";

interface Props {
    showUserLocation?: boolean;
    initialLocation: Location
}

export const MapScreenStudent = ({ showUserLocation = false }: Props) => {
    
    const mapRef = useRef<MapView>();
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    const [isShowingPolyline, setIsShowingPolyline] = useState(true)
    const [socket, setSocket] = useState<WebSocket | null>(null); // Estado para almacenar el objeto WebSocket
    const [reconnectTimer, setReconnectTimer] = useState<NodeJS.Timeout | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [busLocation, setBusLocation] = useState<Location | null>(null);
    const [latitudeState, setLatitudeState] = useState(37.77825);
    const [longitudeState, setLongitudeState] = useState(-122.432)
    
    const connectToWebSocket = () => {
        
        const wsUrl = Platform.OS == 'ios' ? 'ws://localhost:3000' : 'ws://192.168.1.49:3000';

        const ws = new WebSocket(wsUrl);

        // const ws = new WebSocket('ws://192.168.1.39:3000');
        ws.onopen = () => {
            setSocket(ws)            
            setIsConnected(true);
            setReconnectTimer(null); // Si se conecta con éxito, elimina el temporizador de reconexión
        };

        ws.onclose = () => {
            console.log('Conexión WebSocket cerrada');
            setIsConnected(false);
            // Intenta reconectarse después de 5 segundos
            setReconnectTimer(setTimeout(connectToWebSocket, 5000));
        };

        ws.onmessage = (event) => {
            console.log("on mensaje")
            // console.log('Mensaje recibido del servidor:', event.data, typeof (event.data));
            const coordenadasJson = JSON.parse(event.data);
            const latitude = coordenadasJson.payload.latitude;
            const longitude = coordenadasJson.payload.longitude;
            setIsConnected(true)
            if (latitude !== latitudeState || longitude !== longitudeState) {
                setLatitudeState(latitude)
                setLongitudeState(longitude)
                
            }

        };
        return ws
    };

    const socketRef = useRef<WebSocket | null>(null);

    useFocusEffect(
        useCallback(() => {

            socketRef.current = connectToWebSocket();

            return () => {
                if (socketRef.current) {
                    socketRef.current.close();
                }
                // Limpiar el temporizador de reconexión al desmontar el componente
                if (reconnectTimer) {
                    clearTimeout(reconnectTimer);
                }
            };
        }, [])
    );

    const { getLocation, lastKnownLocation, watchLocation, clearWatchLocation, userLocationsList } = useLocationStore();


    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapView
                    ref={(map) => mapRef.current = map!}
                    showsUserLocation={showUserLocation}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    // style={{flex: 1}}
                    onTouchStart={() => setIsFollowingUser(false)}
                    region={{
                        latitude: latitudeState,
                        longitude: longitudeState,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >
                    {
                        isShowingPolyline && (
                            <Polyline
                                coordinates={userLocationsList}
                                strokeColor="red"
                                strokeWidth={5}
                            />
                        )
                    }
                    <Marker coordinate={{ latitude: latitudeState, longitude: longitudeState }}>
                        <Image
                            source={require('../../assets/busudh.png')}
                            style={{ width: 60, height: 30 }}
                        />
                    </Marker>
                    <Paraderos />
                </MapView>
                <View style={{
                    bottom: -280,
                }}>
                    {
                        isConnected ? null : (
                            <Estados/>
                        )
                    }
                                 
                </View>
                <FAB
                    iconName="eye-outline"
                    onPress={() => setIsShowingPolyline(!isShowingPolyline)}
                    style={{
                        bottom: 200,
                        right: 20
                    }}
                />
                <FAB
                    iconName="walk-outline"
                    onPress={() => setIsFollowingUser(!isFollowingUser)}
                    style={{
                        bottom: 140,
                        right: 20
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0CBB70',

    },
    mapContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
});