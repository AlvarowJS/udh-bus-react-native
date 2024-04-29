import { Pressable, Text, View } from 'react-native';
import { permissionStyles } from '../../theme/permissionTheme';
import { usePermissionStore } from '../../store/permissions/usePermissionStore';

const PermissionsScreen = () => {

    const { locationStatus, requestLocationPermission } = usePermissionStore();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Habilitar ubicación</Text>
            <Text>
                Para seguir usando la app es necesario que active la ubicación.
            </Text>

            <Pressable
                style={permissionStyles.btnPrimary}
                onPress={requestLocationPermission}
            >
                <Text style={{ color: 'white' }}>Habilitar Localización</Text>
            </Pressable>


            {/* <Text>Estado actual: {locationStatus}</Text> */}

        </View>
    )
}

export default PermissionsScreen