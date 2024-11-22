import Geolocation from '@react-native-community/geolocation';
import { Location } from '../../interfaces/location';

export const getCurrentLocation = async (): Promise<Location> => {

    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition((info) => {

            resolve({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
            })
        },
            error => {
                console.log('Cant get location')
                reject(error)
            },
            {
                enableHighAccuracy: true
            }
        )
    })
}

export const watchCurrentLocation = (
    locationCallback: (location: Location) => void,
): number => {
    return Geolocation.watchPosition(info => (
        locationCallback({
            latitude: info?.coords?.latitude,
            longitude: info?.coords?.longitude,
        })
    ), (error) => {
        console.log('Cannot get watch position:', error);
    }, {
        enableHighAccuracy: true
    });
};

export const clearWatchLocation = (watchId: number) => {
    Geolocation.clearWatch(watchId);
}