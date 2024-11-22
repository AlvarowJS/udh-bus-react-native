import { Image, Pressable, StyleSheet, Text, View, Platform } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Location } from "../../interfaces/location";
import { getCurrentLocation } from "../../actions/location/location";
import { FAB } from "../ui/FAB";
import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocationStore } from "../../store/location/useLocationStore";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from "@react-navigation/native";
import Paraderos from "./Paraderos";
import Estados from "./Estados";
import { AuthContext } from "../../context/AuthContext";
import busApi from "../../api/busApi";
const URL = '/buses-activos'
interface Props {
    showUserLocation?: boolean;
    initialLocation: Location
}

export const MapScreenStudent = ({ showUserLocation = false }: Props) => {
    const [busesActivo, setBusesActivo] = useState(0)
    const mapRef = useRef<MapView>();
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    const [isShowingPolyline, setIsShowingPolyline] = useState(true)
    const [reconnectTimer, setReconnectTimer] = useState<NodeJS.Timeout | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [busLocation, setBusLocation] = useState<Location | null>(null);
    const [latitudeState, setLatitudeState] = useState(37.77825);
    const [longitudeState, setLongitudeState] = useState(-122.432)
    const { webSocket, refreshState } = useContext(AuthContext)
    const [refresh, setRefresh] = useState(false)
    const [coordinatesList, setCoordinatesList] = useState<Location[]>([]);

    useEffect(() => {
        busApi.get(URL)
            .then(res => {
                setBusesActivo(res?.data?.length)
                console.log(res?.data?.length, "se actobop")                
            })
            .catch(err => console.log(err))
    }, [refresh, webSocket])
    
    const activeWebSocket = () => {
        refreshState()
        return null
    }
    const handleWebSocketMessages = () => {
        if (webSocket) {            
            webSocket.onmessage = (event) => {
                const coordenadasJson = JSON.parse(event.data);                
                const latitude = coordenadasJson.payload.latitude;
                const longitude = coordenadasJson.payload.longitude;                
                
                if (latitude !== latitudeState || longitude !== longitudeState) {
                    setIsConnected(true)
                    setLatitudeState(latitude)
                    setLongitudeState(longitude)

                    setCoordinatesList((prevCoordinates) => {
                        const newCoordinate: Location = { latitude, longitude };
                        const updatedCoordinates = [...prevCoordinates, newCoordinate];

                        // Limitar la lista a un máximo de 10 elementos
                        if (updatedCoordinates.length > 10) {
                            updatedCoordinates.shift();
                        }
                        return updatedCoordinates;
                    });
                }          
            };
        }
       
    };    

    useEffect(() => {
        if (webSocket) {            
            webSocket.onopen = () => {
                console.log("WebSocket connection opened");                
            };
            webSocket.onerror = (error) => {
                console.log("WebSocket error", error);
                setIsConnected(false)
            };
            webSocket.onclose = (event) => {                
                console.log("WebSocket connection closed", event);
                setIsConnected(false);
            };
            handleWebSocketMessages();

        }
        // setIsConnected(false);
    }, [webSocket, refresh]);

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
                                coordinates={coordinatesList}
                                strokeColor="gray"
                                strokeWidth={4}
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
                        busesActivo > 0 ? null : (
                            <Estados />
                        )
                    }               
                </View>
                <FAB
                    iconName="refresh"
                    // onPress={() => setIsShowingPolyline(!isShowingPolyline)}
                    onPress={() => setRefresh(!refresh)}
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