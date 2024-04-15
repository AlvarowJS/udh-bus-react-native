import { Pressable, Text, View } from "react-native"
import { usePermissionStore } from "../../store/permissions/usePermissionStore"



export const MapScreen = () => {

    const { locationStatus, requestLocationPermission } = usePermissionStore();

    return (
        <View>
            <Text>
                MapScreen
            </Text>
            <Pressable
                onPress={requestLocationPermission}
            >
                <Text>Habilitad Locazliacion</Text>
            </Pressable>

            <Text>
                Estado actual: {locationStatus}
            </Text>
        </View>
    )
}
