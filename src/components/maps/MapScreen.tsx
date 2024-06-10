import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Location } from "../../interfaces/location";
import { getCurrentLocation } from "../../actions/location/location";
import { FAB } from "../ui/FAB";
import { useEffect, useRef, useState } from "react";
import { useLocationStore } from "../../store/location/useLocationStore";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    showUserLocation?: boolean;
    initialLocation: Location
}

export const MapScreen = ({ showUserLocation = false, initialLocation }: Props) => {

    const mapRef = useRef<MapView>();
    const cameraLocation = useRef<Location>(initialLocation);
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    const [isShowingPolyline, setIsShowingPolyline] = useState(true)
    const [socket, setSocket] = useState<WebSocket | null>(null); // Estado para almacenar el objeto WebSocket
    const [reconnectTimer, setReconnectTimer] = useState<NodeJS.Timeout | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectToWebSocket = () => {
        // const ws = new WebSocket('ws://localhost:3000');
        const wsUrl = Platform.OS === 'ios' ? 'ws://localhost:3000' : 'ws://192.168.1.39:3000';

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('Conexión WebSocket establecida');
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
            // console.log('Mensaje recibido del servidor:', event.data);
        };

        ws.onerror = (error) => {
            // console.error('Error en la conexión WebSocket:', error);
        };

        return ws;
    };
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
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
    }, []);

    const { getLocation, lastKnownLocation, watchLocation, clearWatchLocation, userLocationsList } = useLocationStore();

    const moveCamaraToLocation = (location: Location) => {
        if (!mapRef.current) return;

        mapRef.current.animateCamera({ center: location });
    }

    const moveToCurrentLocation = async () => {
        if (!lastKnownLocation) {
            moveCamaraToLocation(initialLocation);
        }
        const location = await getLocation();
        if (!location) return;
        moveCamaraToLocation(location)
    }

    useEffect(() => {
        watchLocation();

        return () => {
            clearWatchLocation();
        }
    }, [])

    useEffect(() => {
        if (lastKnownLocation && isFollowingUser) {
            moveCamaraToLocation(lastKnownLocation);
        }
        const message = JSON.stringify({
            latitude: lastKnownLocation?.latitude,
            longitude: lastKnownLocation?.longitude
        });
        socket?.send(message)
    }, [lastKnownLocation, isFollowingUser])

    const UserLocationIcon = () => (
        <MaterialCommunityIcons name="bus-side" size={50} color="black" />
    );
    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapView
                    ref={(map) => mapRef.current = map!}
                    showsUserLocation={showUserLocation}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    // style={{flex: 1}}
                    onTouchStart={() => setIsFollowingUser(false)}
                    region={{
                        latitude: cameraLocation.current.latitude,
                        longitude: cameraLocation.current.longitude,
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
                    {lastKnownLocation && (
                        <Marker coordinate={{ latitude: lastKnownLocation.latitude, longitude: lastKnownLocation.longitude }}>
                            <Image
                                source={require('../../assets/busudh.png')}
                                style={{ width: 60, height: 30 }}
                            />
                        </Marker>
                    )}


                </MapView>
                <FAB
                    iconName="eye-outline"
                    onPress={() => setIsShowingPolyline(!isShowingPolyline)}
                    style={{
                        bottom: 140,
                        right: 20
                    }}
                />
                <FAB
                    iconName="walk-outline"
                    onPress={() => setIsFollowingUser(!isFollowingUser)}
                    style={{
                        bottom: 80,
                        right: 20
                    }}
                />
                <FAB
                    iconName="compass-outline"
                    onPress={moveToCurrentLocation}
                    style={{
                        bottom: 20,
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