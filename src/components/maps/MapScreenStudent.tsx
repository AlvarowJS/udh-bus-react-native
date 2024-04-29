import { Pressable, StyleSheet, Text, View } from "react-native"
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

export const MapScreenStudent = ({ showUserLocation = false }: Props) => {
    const mapRef = useRef<MapView>();
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    const [isShowingPolyline, setIsShowingPolyline] = useState(true)
    const [socket, setSocket] = useState<WebSocket | null>(null); // Estado para almacenar el objeto WebSocket
    const [reconnectTimer, setReconnectTimer] = useState<NodeJS.Timeout | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [busLocation, setBusLocation] = useState<Location | null>(null);

    const connectToWebSocket = () => {
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            console.log('Conexión WebSocket establecida');
            setSocket(ws)
            setIsConnected(true);
            setReconnectTimer(null); // Si se conecta con éxito, elimina el temporizador de reconexión
        };

        ws.onclose = () => {
            console.log('Conexión WebSocket cerrada');
            setIsConnected(false);
            setReconnectTimer(setTimeout(connectToWebSocket, 15000));
        };
        ws.onmessage = (event) => {
            console.log(event.data);
            const data = JSON.parse(event.data);
            console.log(data,"asd")
            // Aquí recibes los datos del bus desde el WebSocket
            // Supongamos que el servidor envía la ubicación del bus como un objeto con las propiedades "latitude" y "longitude"
            if (data.latitude && data.longitude) {
                setBusLocation({ latitude: data.latitude, longitude: data.longitude });
            }
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
        // if (!lastKnownLocation) {
        //     moveCamaraToLocation(initialLocation);
        // }
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
                        latitude: 37.78825,
                        longitude: -122.432,
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
                    {/* {showUserLocation && lastKnownLocation && ( */}
                    <Marker coordinate={{ latitude: 37.78825, longitude: -122.432 }}>
                        <UserLocationIcon />
                    </Marker>
                    {/* )} */}


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