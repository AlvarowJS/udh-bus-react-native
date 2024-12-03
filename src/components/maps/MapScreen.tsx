import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Location } from "../../interfaces/location";
import { getCurrentLocation } from "../../actions/location/location";
import { FAB } from "../ui/FAB";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocationStore } from "../../store/location/useLocationStore";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from "../../context/AuthContext";

interface Props {
    showUserLocation?: boolean;
    initialLocation: Location
}

export const MapScreen = ({ showUserLocation = false, initialLocation }: Props) => {

    const mapRef = useRef<MapView>();
    const cameraLocation = useRef<Location>(initialLocation);
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    const [isShowingPolyline, setIsShowingPolyline] = useState(true)    
    const { webSocket } = useContext(AuthContext)
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
        // if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        //     const message = JSON.stringify({
        //         type: 'update-bus-coordinate',
        //         payload: {
        //             bus: "bus",
        //             latitude: lastKnownLocation?.latitude,
        //             longitude: lastKnownLocation?.longitude
        //         }
        //     });
        //     webSocket.send(message);
        // } else {
        //     console.log("El WebSocket no está listo para enviar mensajes.");
        // }
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({
                type: 'update-bus-coordinate',
                payload: {
                    bus: "bus",
                    latitude: lastKnownLocation?.latitude,
                    longitude: lastKnownLocation?.longitude
                }
            });
            try {
                webSocket.send(message);
            } catch (error) {
                console.log("Error al enviar mensaje WebSocket:", error);
            }
        } else {
            console.log("El WebSocket no está listo para enviar mensajes.");
        }
        
        
        // if (webSocket) {            
        //     const message = JSON.stringify({
        //         type: 'update-bus-coordinate',
        //         payload: {
        //             bus: "bus",
        //             latitude: lastKnownLocation?.latitude,
        //             longitude: lastKnownLocation?.longitude
        //         }
        //     });
        //     webSocket.send(message);
        // } else {
        //     console.log("WebSocket not ready. Current state:", webSocket);
        // }

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
                        latitude: cameraLocation?.current?.latitude,
                        longitude: cameraLocation?.current?.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >
                    {
                        isShowingPolyline && (
                            <Polyline
                                coordinates={userLocationsList}
                                strokeColor="gray"
                                strokeWidth={4}
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